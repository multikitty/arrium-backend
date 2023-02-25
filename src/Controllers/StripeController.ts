import { FreeTrial } from "Interfaces/stripeInterfaces";
import moment from "moment";
import UserServices from "../Services/UserServices";
import { SignupServices } from "../Services/SignupServices";
import StripeServices from "../Services/StripeServices";
import AlertController from "./AlertController";
import AlertServices from "../Services/AlertServices";

export default class StripeController {
  async createStripeCustomer(req: any, res: any) {
    const { sk, pk } = req.body;
    try {
      const exis_user = (await new UserServices().getUserData({ sk, pk }))
        ?.Item;
      const stripeCust = await new StripeServices().createCustomer({
        email: "zeus@arrium.com",
        name: "Zeus Thunder",
        customerId: exis_user?.customerID,
        pk,
        sk,
      });
      const cus = await new UserServices().updateProfile({
        sk,
        pk,
        fieldName: "stripeID",
        fieldValue: stripeCust?.id,
      });
      return res.status(200).json({ exis_user, stripeCust, cus });
    } catch (err) {
      return res
        .status(500)
        .json({ error: err, message: "Something went wrong" });
    }
  }
  async getPricingPlans(req: any, res: any) {
    const {
      getAll = false,
      active = true,
      name = "",
      plan_type,
      country,
    } = req.query;
    try {
      const data = await new StripeServices().getPricingPlans({
        getAll,
        active,
        name,
        plan_type,
        country,
      });
      return res.status(200).json({
        data,
        error: false,
        message: "Successfully fetched pricing plans",
      });
    } catch (err: any) {
      return res.status(500).json({ error: true, message: err?.message });
    }
  }

  async createCustomerStripe(
    email: string,
    name: string,
    customerId: number,
    pk: string,
    sk: string
  ) {
    try {
      const res = await new StripeServices().createCustomer({
        email,
        name,
        customerId,
        pk,
        sk,
      });
      return res;
    } catch (error: any) {
      throw Error(error?.message);
    }
  }

  async handleStripeEvents(req: any, res: any) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const payload = req.rawBody;
    const signature = req.headers["stripe-signature"];
    const { pk } = req.body;
    console.log({ payload });
    try {
      const event = await new StripeServices().constructEvent({
        payload,
        secret,
        signature,
      });
      const event_type = event?.type;
      const data = event?.data?.object;
      const stripeId = data?.customer;
      console.log({ event_type, data });

      switch (event_type) {
        case "customer.subscription.deleted":
          /*check if current ended subscription is of free trial
            if free trial and not subscribed to any other subscription then change status inactive
          */
          //TODO get user by stripeId
          const stripe_customer = await new StripeServices().getCustomer(
            stripeId
          );
          console.log({ stripe_customer, meta: stripe_customer?.metadata });
          if (stripe_customer) {
            const { pk, sk } = stripe_customer?.metadata;
            const user = (await new UserServices().getUserData({ sk, pk }))
              ?.Item;
            console.log({ user, t: data?.trial_end, s: data?.ended_at });
            // should be true trial_end
            if (stripeId && data?.trial_end && user && data?.ended_at) {
              let scheduled_subscriptions = (
                await new StripeServices().getSubscriptionSchedules(
                  user.stripeID
                )
              )?.data;
              if (scheduled_subscriptions?.length) {
                scheduled_subscriptions = scheduled_subscriptions.filter(
                  (itm: any) => itm?.status !== "canceled"
                );
                if (!scheduled_subscriptions?.length) {
                  //make user status inactive
                  let update_user = {
                    sk: user.sk,
                    pk: user.pk,
                    fieldName: "accountStatus",
                    fieldValue: "inActive",
                  };
                  await new UserServices().updateProfile(update_user);
                  update_user = {
                    sk: user.sk,
                    pk: user.pk,
                    fieldName: "pricingPlan",
                    fieldValue: "true",
                  };
                  await new UserServices().updateProfile(update_user);
                  update_user = {
                    sk,
                    pk,
                    fieldName: 'status',
                    fieldValue: 'expired',
                  };
                  await new UserServices().updateProfile(update_user);
                }

              }
              console.log("&****", { scheduled_subscriptions });
              //show plan page
            }
          }
          break;
        case "invoice.created":
          if (!data?.paid) {
            const plan_type =
              data?.lines?.data[0]?.price?.metadata["plan type"];
            const productId = data?.lines?.data[0]?.price?.product;
            const product = await new StripeServices().getProduct(productId);
            const invoice_id = data.id;
            const invoice_data = {
              description: `${plan_type[0].toUpperCase() + plan_type.slice(1)
                }: ${product?.name} (${moment
                  .unix(data?.lines?.data[0]?.period?.start)
                  .format("MMM DD,YYYY")} - ${moment
                    .unix(data?.lines?.data[0]?.period?.end)
                    .format("MMM DD,YYYY")})`,
            };
            await new StripeServices().updateInvoice(data?.id, invoice_data);
            const currentTime = Date.now()
            const inv_num = invoice_id.split('-')[invoice_id.split('-').length - 1]
            await new AlertServices().insertPaymentAlert({ pk: pk, currentTime: currentTime, notifType: 'invoice', invID: inv_num, notifViewed: false });
            if (data?.subscription) {
              const sub_id = data.subscription;
              const subscription = await new StripeServices().getSubscription(
                sub_id
              );
              //changing status of free trial invoice
              if (subscription?.trial_end) {
                await new StripeServices().payInvoice(invoice_id);
              }
            }
          }
          break;
        case "invoice.paid":
          const invoice_id = data.id;
          const customer = await new StripeServices().getCustomer(stripeId);
          const notificationBody = {
            invoiceId: invoice_id,
            pk: pk,
            currentTime: Date.now(),
          };
          // await new AlertServices().updateAlert(notificationBody);
          if (customer) {
            const { pk, sk } = customer?.metadata;
            if (pk && sk) {
              const currentTime = Date.now();
              await new AlertServices().updatePaymentAlert(pk, sk, currentTime);
              const user = (await new UserServices().getUserData({ sk, pk }))?.Item;
              console.log({ user });
              if (user) {
                if (user?.status !== 'Active') {
                  let update_data = {
                    sk,
                    pk,
                    fieldName: "accountStatus",
                    fieldValue: "Active",
                  };
                  await new UserServices().updateProfile(update_data);
                }
                const lineItem = data?.lines?.data[0]

                console.log({ lineItem, lineItem_length: data?.lines?.data?.length })
                if (lineItem) {
                  //GET PRODUCT META AND TYPE 
                  const prodId = lineItem?.price?.product;
                  const product = await new StripeServices().getProduct(prodId)
                  console.log({ product, meta: product.metadata })
                }
              }
            }
          }
          break;
        default:
        // throw Error(`Unhandled Event ${event?.type}`);
      }
      return res.status(200);
    } catch (error: any) {
      console.log({ error });
      res.end();
    }
  }

  public async subscribeToFreeTrial(data: FreeTrial) {
    const { pk, sk } = data;
    try {
      const {
        Item: { firstname, lastname, email, customerID },
      }: any = await new UserServices().getUserData({
        pk,
        sk,
      });
      const stripe_customer = await new StripeServices().createCustomer({
        email,
        name: `${firstname} ${lastname}`,
        customerId: customerID,
        pk,
        sk,
      });
      //get all areas plan id from stripe
      let plans: any = await new StripeServices().getPricingPlans({
        active: true,
        getAll: false,
        plan_type: "basic",
        name: "All Areas",
        country: "UK",
      });
      if (!plans?.length) {
        throw Error("Plan not found");
      }
      plans = plans[0]?.price?.id;
      const subs_schedule_data = {
        customer: stripe_customer.id,
        metadata: {
          is_free_trial: true,
        },
        start_date: moment().add(10, "s").unix(),
        end_behavior: "cancel",
        phases: [
          {
            trial: true,
            end_date: moment().add(7, "d").endOf("day").unix(),
            items: [
              {
                price: plans,
                quantity: 1,
              },
            ],
          },
        ],
      };
      ///
      const subscription = await new StripeServices().subscribeToPlan({
        customerId: stripe_customer.id,
        planId: plans,
        isFreeTrial: true,
        collection_method: "send_invoice",
      });
      let update_data = {
        sk,
        pk,
        fieldName: 'planType',
        fieldValue: 'trial',
      };
      await new UserServices().updateProfile(update_data);
      update_data = {
        sk,
        pk,
        fieldName: 'status',
        fieldValue: 'active',
      };
      await new UserServices().updateProfile(update_data);
      const user = await new StripeServices().updateStripeClientId({
        pk,
        sk,
        stripeID: stripe_customer.id,
      });

      return user;
    } catch (err: any) {
      throw Error(`Something went wrong! ${err?.message}`);
    }
  }
  public async onSelectPlan(req: any, res: any) {
    const { id } = req.params;
    const { pk, sk } = req.body;
    //get user
    const user = (await new UserServices().getUserData({ pk, sk }))?.Item;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!user?.stripeID) {
      return res
        .status(404)
        .json({ success: false, message: "User stripeID not found" });
    }
    try {
      const plan = await new StripeServices().getPlan(id);
      if (!plan) {
        return res
          .status(404)
          .json({ success: false, message: "Plan not found" });
      }
      const subscriptions = (
        await new StripeServices().getCustomerSubscriptions({
          customer: user.stripeID,
          status: "all",
        })
      )?.data;
      const free_trial = subscriptions?.filter(
        (itm: any) => itm?.metadata?.is_free_trial
      )[0];
      const free_trial_end_date = moment
        .unix(free_trial?.trial_end)
        .format("YYYY-MM-DD hh:mm:ss");
      const month_end = moment(free_trial_end_date).endOf("month").endOf("day");
      const start_of_next_month = moment(month_end)
        .add(1, "months")
        .startOf("month")
        .startOf("day")
        .format("YYYY-MM-DD hh:mm:ss");
      const days_difference = Math.abs(
        month_end.diff(free_trial_end_date, "days")
      );
      const scheduleData = {
        customer: user.stripeID,
        start_date: moment(new Date(start_of_next_month)).unix(), //start date of subsc schedule
        end_behavior: "release",
        phases: [
          {
            items: [
              {
                price: id,
              },
            ],
            proration_behavior: "create_prorations",
            collection_method: "send_invoice",
            invoice_settings: { days_until_due: 0 },
          },
        ],
      };

      // //invoice
      const invoiceData = {
        customer: user.stripeID,
        collection_method: "send_invoice",
        due_date: moment(start_of_next_month).endOf("day").unix(),
      };
      plan.amount = ((plan.amount / 30) * days_difference)?.toFixed(2);
      const product = await new StripeServices().getProduct(plan.product);
      const invoiceItemData = {
        customer: user.stripeID,
        unit_amount_decimal: plan.amount,
        currency: plan.currency,
        description: `${plan?.metadata["plan type"][0].toUpperCase() +
          plan?.metadata["plan type"].slice(1)
          }: ${product?.name} (${moment(free_trial_end_date).format(
            "MMM DD,YYYY"
          )} - ${moment(new Date(month_end.format("YYYY-MM-DD hh:mm:ss"))).format(
            "MMM DD,YYYY"
          )})`,
        period: {
          start: moment(free_trial_end_date).unix(), //free trial end-date
          end: month_end.endOf("day").unix(),
        },
      };
      await new StripeServices().createInvoiceItem(invoiceItemData);
      const invoice = await new StripeServices().createInvoice(invoiceData);
      let finalized_invoice = null;
      if (invoice?.id) {
        finalized_invoice = await new StripeServices().finalizeInvoice(
          invoice?.id
        );
      }
      await new StripeServices().createSubscriptionSchedule(scheduleData);
      return res.status(200).json({
        success: true,
        message: "Successfully subscribe to plan",
        invoice_url: finalized_invoice?.hosted_invoice_url,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  }

  public async getInvoices(req: any, res: any) {
    const { sk, pk } = req.body;
    const { page = 1, limit = 10, start_after, end_before } = req.query;
    try {
      const user = (await new UserServices().getUserData({ sk, pk }))?.Item;
      if (!user?.stripeID) {
        return res.status(404).json({
          success: false,
          message: "Something went wrong",
          error: "User Stripe Id not found",
        });
      }
      const data: any = {
        customer: user?.stripeID,
        limit: limit ?? 10,
        page: Number(page),
      };
      if (page > 1) {
        data.page = Number(page);
      }
      if (start_after) {
        data.starting_after = start_after;
      }
      if (end_before) {
        data.ending_before = end_before;
      }
      let invoices = await new StripeServices().getInvoices(data);
      if (invoices?.length) {
        invoices = invoices?.data?.sort((a: any, b: any) => a?.created - b.created)
      }

      const invoices_data = invoices?.data?.map((invoice: any) => {
        const data = {
          id: invoice?.id,
          invoice_no: invoice?.number,
          stripe_id: invoice?.customer,
          description: invoice?.lines?.data[0]?.description,
          amount_due: invoice?.amount_due ? invoice?.amount_due / 100 : 0,
          due_date: invoice?.due_date
            ? moment.unix(invoice?.due_date).format("MMM DD,YYYY")
            : null,
          paid_at: invoice?.status_transitions?.paid_at
            ? moment
              .unix(invoice?.status_transitions?.paid_at)
              .format("MMM DD,YYYY")
            : null,
          invoice_url: invoice?.hosted_invoice_url,
          paid_status: new StripeServices().getPaidStatus({
            paid: invoice?.paid,
            due_date: invoice?.due_date,
          }),
          period_start: invoice?.lines?.data[0]?.period?.start
            ? moment
              .unix(invoice?.lines?.data[0]?.period?.start)
              .format("MMM DD,YYYY")
            : null,
          period_end: invoice?.lines?.data[0]?.period?.end
            ? moment
              .unix(invoice?.lines?.data[0]?.period?.end)
              .format("MMM DD,YYYY")
            : null,
        };
        return data;
      });
      let starting_after = null;
      let ending_before = null;
      let has_more = invoices?.has_more ?? false;
      if (has_more && invoices_data?.length > 1) {
        starting_after = invoices_data[invoices_data.length - 1]?.id;
        ending_before = invoices_data[0]?.id;
      } else if (
        has_more &&
        invoices_data?.length &&
        invoices_data?.length <= 1
      ) {
        starting_after = invoices_data[0]?.id;
        ending_before = invoices_data[0]?.id;
      } else if (!has_more && invoices_data?.length && !end_before) {
        starting_after = null;
        ending_before = invoices_data[0]?.id;
      } else if (!has_more && invoices_data?.length) {
        starting_after = invoices_data[invoices_data?.length - 1]?.id;
        ending_before = null;
      }
      if (end_before && !has_more) {
        starting_after = invoices_data[invoices_data?.length - 1]?.id;
        has_more = true
      }

      return res?.status(200).json({
        success: true,
        data: invoices_data,
        has_more,
        starting_after,
        ending_before,
        currentPage: page,
        has_next_page: has_more ? true : false,
        nextPage: has_more ? +page + 1 : null,
        prevPage: ending_before ? +page - 1 : null,
        message: 'Successfully fetched invoices',
      });
    } catch (error) {
      return res
        ?.status(500)
        .json({ success: false, error, message: "Something went wrong" });
    }
  }
  public async getInvoicesAdmin(req: any, res: any) {
    const { sk, pk } = req.query;
    const { page = 1, start_after, end_before, limit = 10 } = req.query;
    try {
      let user: any = (await new UserServices().getUserData({ sk, pk }))?.Item;
      if (!user?.stripeID) {
        return res.status(404).json({
          success: false,
          message: "Something went wrong",
          error: "User Stripe Id not found",
        });
      }
      const data: any = {
        customer: user?.stripeID,
        limit,
        page: Number(page),
      };
      if (page > 1) {
        data.page = Number(page);
      }
      if (start_after) {
        data.starting_after = start_after;
      }
      if (end_before) {
        data.ending_before = end_before;
      }
      let invoices = await new StripeServices().getInvoices(data);
      if (invoices?.length) {
        invoices = invoices?.data?.sort((a: any, b: any) => a?.created - b.created)
      }
      const invoices_data = invoices?.data?.map((invoice: any) => {
        const data = {
          id: invoice?.id,
          invoice_no: invoice?.number,
          stripe_id: invoice?.customer,
          description: invoice?.lines?.data[0]?.description,
          amount_due: invoice?.amount_due ? invoice?.amount_due / 100 : 0,
          due_date: invoice?.due_date
            ? moment.unix(invoice?.due_date).format("MMM DD,YYYY")
            : null,
          paid_at: invoice?.status_transitions?.paid_at
            ? moment
              .unix(invoice?.status_transitions?.paid_at)
              .format("MMM DD,YYYY")
            : null,
          invoice_url: invoice?.hosted_invoice_url,
          paid_status: new StripeServices().getPaidStatus({
            paid: invoice?.paid,
            due_date: invoice?.due_date,
          }),
          period_start: invoice?.lines?.data[0]?.period?.start
            ? moment
              .unix(invoice?.lines?.data[0]?.period?.start)
              .format("MMM DD,YYYY")
            : null,
          period_end: invoice?.lines?.data[0]?.period?.end
            ? moment
              .unix(invoice?.lines?.data[0]?.period?.end)
              .format("MMM DD,YYYY")
            : null,
        };
        return data;
      });
      let starting_after = null;
      let ending_before = null;
      let has_more = invoices?.has_more ?? false;
      if (has_more && invoices_data?.length > 1) {
        starting_after = invoices_data[invoices_data.length - 1]?.id;
        if (page > 1) {
          ending_before = invoices_data[0]?.id;
        }
      } else if (has_more && invoices_data?.length && invoices_data?.length <= 1) {
        starting_after = invoices_data[0]?.id;
        ending_before = invoices_data[0]?.id;
      } else if (!has_more && invoices_data?.length && !end_before) {
        starting_after = null;
        ending_before = invoices_data[0]?.id;
      } else if (!has_more && invoices_data?.length) {
        starting_after = invoices_data[invoices_data?.length - 1]?.id;
        ending_before = null;
      }
      if (end_before && !has_more) {
        starting_after = invoices_data[invoices_data?.length - 1]?.id;
        has_more = true
      }

      return res?.status(200).json({
        success: true,
        data: invoices_data,
        has_more,
        starting_after,
        ending_before,
        currentPage: page,
        has_next_page: has_more ? true : false,
        nextPage: has_more ? +page + 1 : null,
        prevPage: ending_before ? +page - 1 : null,
        message: 'Successfully fetched invoices',
      });
    } catch (error) {
      return res
        ?.status(500)
        .json({ success: false, error, message: "Something went wrong" });
    }
  }
  /**
   * Disable customers whose invoice is not paid
   * after 5 days
   * @returns
   */
  public disableCustomersFiveDays = async () => {
    try {
      const users: any = (await new UserServices().getAllUsers({}))?.Items;
      if (users?.length) {
        for (let user of users) {
          const { sk, pk } = user;
          if (user?.stripeID) {
            try {
              const invoices = (
                await new StripeServices().getInvoices({
                  customer: user.stripeID,
                  getAll: true,
                })
              )?.data;
              if (invoices?.length) {
                const unpaid_invoices = invoices.filter(
                  (itm: any) =>
                    !itm.paid && moment() > moment.unix(itm.due_date)
                );
                if (unpaid_invoices?.length) {
                  const update_data = {
                    sk,
                    pk,
                    fieldName: "accountStatus",
                    fieldValue: "disable",
                  };
                  await new UserServices().updateProfile(update_data);
                }
              }
            } catch {
              console.log("in catch");
              continue;
            }
          }
        }
      }
    } catch (err) {
      return err;
    }
  };
}
