import ZendeskServices from "../Services/ZendeskServices";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import {
  ZendeskCreateTicket,
  ZendeskFAQListByLang,
} from "../Interfaces/zendeskInterface";

export default class ZendeskController {
  // upload file controller
  async uploadFile(request: any, response: any) {
    const fileName = uuidv4();
    fs.writeFileSync(`uploads/${fileName}.jpg`, request.body);
    await new ZendeskServices()
      .uploadAttechment(
        fileName,
        fs.createReadStream(`uploads/${fileName}.jpg`)
      )
      .then(async (result: any) => {
        response.status(200);
        response.send({
          success: false,
          message: "File Uploaded sucessfully!",
          result: result.upload,
        });
        fs.unlinkSync(`uploads/${fileName}.jpg`);
      })
      .catch((error: any) => {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  // create Ticket controller
  async createTicket(request: any, response: any) {
    try {
      let params: ZendeskCreateTicket = {
        created_at: Date.now(),
        comment: {
          uploads: [request.body.uploadToken],
        },
        description: request.body.message,
        raw_subject: "",
        recipient: request.body.zendeskUserEmail,
        subject: request.body.subject,
        priority: "normal",
        status: "new",
        submitter_id: request.body.zendeskUserId,
        type: "incident",
      };

      await new ZendeskServices()
        .createSupportTicket(params)
        .then(async (result: any) => {
          response.status(200);
          response.send({
            success: false,
            message: "Ticket created sucessfully!",
          });
        })
        .catch((error: any) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error: error,
          });
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  }

  // create Ticket controller
  async getFAQLists(request: any, response: any) {
    try {
      const language = request.query.language;
      await new ZendeskServices()
        .getSections(request.query.language)
        .then(async (result) => {
          const env =
            process.env.NODE_ENV == "production"
              ? "Production"
              : process.env.NODE_ENV == "development"
              ? "Development"
              : "Staging";
          const sections = result?.data.sections || [];
          let sectionId = sections.filter((item: any) => item.name == env);
          sectionId = sectionId[0].id;
          const params: ZendeskFAQListByLang = {
            language: language,
            sectionId: sectionId,
          };

          await new ZendeskServices()
            .getAllFAQListByLang(params)
            .then((result) => {
              let FAQQuestions = result;
              const UserSegmentID = {
                driver: "7695497162013",
                admin: "7695510112157",
                sales: "9888424069277",
              };
              switch (request.body.role) {
                case "driver":
                  FAQQuestions = result.data.articles.filter(
                    (item: any) =>
                      item.user_segment_id === Number(UserSegmentID.driver)
                  );
                  break;
                case "sales":
                  FAQQuestions = result.data.articles.filter(
                    (item: any) =>
                      item.user_segment_id === Number(UserSegmentID.sales)
                  );
                  break;
                case "admin":
                  FAQQuestions = result.data.articles.filter(
                    (item: any) =>
                      item.user_segment_id === Number(UserSegmentID.admin)
                  );
                  break;
                default:
              }

              FAQQuestions = FAQQuestions.filter((item: any) => !item.draft);

              response.status(200);

              response.send({
                success: false,
                message: "File Uploaded sucessfully!",
                result: FAQQuestions || [],
              });
            })
            .catch((error) => {
              response.status(500);
              response.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error: error,
              });
            });
        })
        .catch((error) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error: error,
          });
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  }
}
