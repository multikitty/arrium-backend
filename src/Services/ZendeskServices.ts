import {
  ZendeskCreateOrganization,
  ZendeskUser,
  ZendeskMakePrimary,
  ZendeskCreateTicket,
  ZendeskPrimaryEmailParams,
  ZendeskUpdateUser,
  ZendeskFAQListByLang
} from "../Interfaces/zendeskInterface";

const axios = require("axios");

export default class ZendeskServices {
  // create org in zendesk
  async createZendeskOrganisation(params: ZendeskCreateOrganization) {
    return await axios
      .post(
        `${process.env.ZENDESK_BASE_URL}api/v2/organizations`,
        { organization: params },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
  }

  // get all sections
  async getSections(language:string) {
    console.log("language",language, `${process.env.ZENDESK_BASE_URL}api/v2/help_center/${language}/sections` )
    return await axios
      .get(
        `${process.env.ZENDESK_BASE_URL}api/v2/help_center/${language}/sections`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
  }

  // delete org in zendesk
  async deleteZendeskOrganisation(zendeskOrgID: string) {
    await axios.delete(`${process.env.ZENDESK_BASE_URL}api/v2/organizations/${zendeskOrgID}`, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    })
  }


  // delete org in zendesk
  async updateZendeskOrganisation(params: any) {
    await axios.put(`${process.env.ZENDESK_BASE_URL}api/v2/organizations/${params.zendeskOrgId}`, { "organization": params }, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw new Error(error.response.data.details);
    })
  }



  // get org list from zendesk
  async getZendeskOrganizationsList() {
    await axios
      .get(`${process.env.ZENDESK_BASE_URL}api/v2/organizations`, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip,deflate,compress",
          Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
        },
      })
      .then((result: any) => {
        return result.data;
      })
      .catch((error: any) => {
        throw error;
      });
  }

  // create zendesk user
  async createZendeskUser(params: ZendeskUser) {
    return await axios
      .post(
        `${process.env.ZENDESK_BASE_URL}api/v2/users`,
        { user: params },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
  }

  // update zendesk user
  public async updateZendeskUser(params: ZendeskUpdateUser) {
    return await axios
      .put(
        `${process.env.ZENDESK_BASE_URL}api/v2/users/${params.zendeskUserId}`,
        { user: params },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
  }

  // get zendesk identity userid
  public async getUserIdentities(zendeskUserId: string) {
    await axios
      .get(
        `${process.env.ZENDESK_BASE_URL}api/v2/users/${zendeskUserId}/identities`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
      .then((result: any) => {
        return result.data;
      })
      .catch((error: any) => {
        throw error;
      });
  }

  // make zendesk user email primary
  public async makeZendeskUserEmailPrimary(params: ZendeskMakePrimary) {
    await axios
      .put(
        `${process.env.ZENDESK_BASE_URL}api/v2/users/${params.zendeskUserId}/identities/${params.zendeskUserIdentityId}/make_primary`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
      .then((result: any) => {
        return result.data;
      })
      .catch((error: any) => {
        throw error;
      });
  }

  // upload attechment in zendesk
  public async uploadAttechment(filename: string, params: any) {
    await axios
      .post(
        `${process.env.ZENDESK_BASE_URL}api/v2/uploads.json?filename=${filename}`,
        params,
        {
          headers: {
            "Content-Type": "image/png",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
      .then((result: any) => {
        return result.data;
      })
      .catch((error: any) => {
        throw error;
      });
  }

  // crete ticket in zendesk
  public async createSupportTicket(params: ZendeskCreateTicket) {
    await axios
      .post(
        `${process.env.ZENDESK_BASE_URL}api/v2/tickets.json`,
        { ticket: params },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
      .then((result: any) => {
        return result.data;
      })
      .catch((error: any) => {
        throw error;
      });
  }

  // make zendesk email id primary using zendeskuser id
  public async makeZendeskEmailPrimaryByZendeskUserId(
    params: ZendeskPrimaryEmailParams,
  ) {
    await this.getUserIdentities(params.zendeskUserId)
      .then(async (result: any) => {
        const emailIdenties = result.identities.filter((item: any) =>
          item.value == params.email ? item : null,
        )[0];
        const zendeskMakePrimaryParams: ZendeskMakePrimary = {
          zendeskUserId: params.zendeskUserId,
          zendeskUserIdentityId: emailIdenties,
        };
        await this.makeZendeskUserEmailPrimary(zendeskMakePrimaryParams)
          .then((result) => {
            return result;
          })
          .catch((error: any) => {
            return error;
          });
      })
      .catch((error: any) => {
        return error;
      });
  }


  // get all categories in zendesk FAQ
  public async getAllFAQListByLang(params: ZendeskFAQListByLang) {
    console.log(`${process.env.ZENDESK_BASE_URL}api/v2/help_center/${params.language}/sections/${params.sectionId}/articles`)
    return await axios
      .get(
        `${process.env.ZENDESK_BASE_URL}api/v2/help_center/${params.language}/sections/${params.sectionId}/articles`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,compress",
            Authorization: `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`,
          },
        },
      )
  }
}
