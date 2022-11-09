import { Request, Response } from "express";
import AWS from "aws-sdk"


export default class SesTemplatesController {
    
    /**
        * createEmailTemplate
        */
    public async createEmailTemplate(req: Request, res: Response) {
        const ses = new AWS.SES();
        const parameters = {
            Template: {
                TemplateName: 'test_template3',
                HtmlPart: `<!DOCTYPE html>

                <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                <head>
                <title></title>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
                <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
                <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
                <style>
                        * {
                            box-sizing: border-box;
                        }
                
                        body {
                            margin: 0;
                            padding: 0;
                        }
                
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                            text-decoration: inherit !important;
                        }
                
                        #MessageViewBody a {
                            color: inherit;
                            text-decoration: none;
                        }
                
                        p {
                            line-height: inherit
                        }
                
                        .desktop_hide,
                        .desktop_hide table {
                            mso-hide: all;
                            display: none;
                            max-height: 0px;
                            overflow: hidden;
                        }
                
                        @media (max-width:670px) {
                
                            .desktop_hide table.icons-inner,
                            .social_block.desktop_hide .social-table {
                                display: inline-block !important;
                            }
                
                            .icons-inner {
                                text-align: center;
                            }
                
                            .icons-inner td {
                                margin: 0 auto;
                            }
                
                            .fullMobileWidth,
                            .image_block img.big,
                            .row-content {
                                width: 100% !important;
                            }
                
                            .mobile_hide {
                                display: none;
                            }
                
                            .stack .column {
                                width: 100%;
                                display: block;
                            }
                
                            .mobile_hide {
                                min-height: 0;
                                max-height: 0;
                                max-width: 0;
                                overflow: hidden;
                                font-size: 0px;
                            }
                
                            .desktop_hide,
                            .desktop_hide table {
                                display: table !important;
                                max-height: none !important;
                            }
                        }
                    </style>
                </head>
                <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6fc;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; text-align: center; padding-top: 45px;">
                <table align="center" cellpadding="0" cellspacing="0" class="alignment" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tr>
                <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;"><img align="center" alt="Logo" class="icon" height="64" src="images/Logo_black_top.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="87"/></td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="15" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad">
                <h1 style="margin: 0; color: #131313; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Building Digital Products, Brands Experience</strong></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad">
                <div style="color:#393d47;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque.</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="button_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad">
                <div align="center" class="alignment">
                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:150px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#5046C7" fillcolor="#5046c7"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#5046c7;border-radius:4px;width:auto;border-top:1px solid #5046C7;font-weight:400;border-right:1px solid #5046C7;border-bottom:1px solid #5046C7;border-left:1px solid #5046C7;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;">Follow Us Now</span></span></a>
                <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="Girl With Laptop" class="fullMobileWidth" src="images/Feedback.png" style="display: block; height: auto; border: 0; width: 488px; max-width: 100%;" title="Girl With Laptop" width="488"/></div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <div class="spacer_block" style="height:55px;line-height:55px;font-size:1px;"> </div>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="text-align:center;width:100%;padding-top:5px;">
                <h1 style="margin: 0; color: #131313; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">99.50%</span></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                <div style="color:#131313;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">Positive Feedback</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;">
                <div style="color:#a9a9a9;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">From Our Clients</p>
                </div>
                </td>
                </tr>
                </table>
                </td>
                <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="text-align:center;width:100%;padding-top:5px;">
                <h1 style="margin: 0; color: #131313; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">65k+</span></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                <div style="color:#131313;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">Instagram Followers</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;">
                <div style="color:#a9a9a9;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">Favourite App</p>
                </div>
                </td>
                </tr>
                </table>
                </td>
                <td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="text-align:center;width:100%;padding-top:5px;">
                <h1 style="margin: 0; color: #131313; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">1.350+</span></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                <div style="color:#131313;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">Shared Content</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;">
                <div style="color:#a9a9a9;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">Support From Followers</p>
                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <div class="spacer_block" style="height:50px;line-height:50px;font-size:1px;"> </div>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0f1221; background-size: auto;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:10px;padding-top:55px;">
                <div style="color:#a59ee5;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:22.5px;">
                <p style="margin: 0;">Support</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-left:15px;padding-right:15px;padding-top:5px;text-align:center;width:100%;">
                <h2 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Social Media Boom!</strong></h2>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:10px;">
                <div align="left" class="alignment">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="45%">
                <tr>
                <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 2px solid #5046C7;"><span> </span></td>
                </tr>
                </table>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:10px;padding-top:10px;">
                <div style="color:#cdcdcd;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:22.5px;">
                <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. </p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:10px;padding-top:10px;">
                <div style="color:#cdcdcd;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:22.5px;">
                <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque.</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="button_block block-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:40px;padding-left:15px;padding-right:10px;padding-top:35px;text-align:left;">
                <div align="left" class="alignment">
                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:146px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#5046C7" fillcolor="#5046c7"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#5046c7;border-radius:4px;width:auto;border-top:1px solid #5046C7;font-weight:400;border-right:1px solid #5046C7;border-bottom:1px solid #5046C7;border-left:1px solid #5046C7;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;">Our Instagram</span></span></a>
                <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                </div>
                </td>
                </tr>
                </table>
                </td>
                <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="Ecommerce App" src="images/main_image_1.png" style="display: block; height: auto; border: 0; width: 325px; max-width: 100%;" title="Ecommerce App" width="325"/></div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-left:15px;padding-right:10px;padding-top:60px;">
                <div style="color:#5046c7;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:22.5px;">
                <p style="margin: 0;">Support</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="15" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad">
                <h1 style="margin: 0; color: #131313; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Receiving Discount by Following Us On Social Media </span></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:35px;padding-left:10px;padding-right:10px;padding-top:10px;">
                <div style="color:#393d47;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque.</p>
                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 5px; padding-right: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:5px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="Social Media" class="fullMobileWidth" src="images/social_medias.png" style="display: block; height: auto; border: 0; width: 207px; max-width: 100%;" title="Social Media" width="207"/></div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-left:10px;text-align:center;width:100%;padding-top:45px;">
                <h1 style="margin: 0; color: #020402; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 42px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder"><span style="color: #7047ec;">You</span> are </span></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:10px;text-align:center;width:100%;">
                <h1 style="margin: 0; color: #020402; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 42px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">The <span style="color: #7047ec;">One</span></span></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad">
                <div style="color:#393d47;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:21px;">
                <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum.</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="button_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:15px;padding-left:15px;padding-right:10px;padding-top:10px;text-align:left;">
                <div align="left" class="alignment">
                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:150px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#5046C7" fillcolor="#5046c7"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#5046c7;border-radius:4px;width:auto;border-top:1px solid #5046C7;font-weight:400;border-right:1px solid #5046C7;border-bottom:1px solid #5046C7;border-left:1px solid #5046C7;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;">Follow Us Now</span></span></a>
                <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                </div>
                </td>
                </tr>
                </table>
                </td>
                <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 5px; padding-right: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:5px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="Social Media" class="fullMobileWidth" src="images/insta.png" style="display: block; height: auto; border: 0; width: 207px; max-width: 100%;" title="Social Media" width="207"/></div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:10px;padding-bottom:5px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="hand with phone" class="fullMobileWidth" src="images/sharing_app.png" style="display: block; height: auto; border: 0; width: 207px; max-width: 100%;" title="hand with phone" width="207"/></div>
                </td>
                </tr>
                </table>
                </td>
                <td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 5px; padding-right: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:5px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="app Insta" class="fullMobileWidth" src="images/phone_image.png" style="display: block; height: auto; border: 0; width: 207px; max-width: 100%;" title="app Insta" width="207"/></div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:10px;padding-bottom:5px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="hand grabbing heart" class="fullMobileWidth" src="images/app_main.png" style="display: block; height: auto; border: 0; width: 207px; max-width: 100%;" title="hand grabbing heart" width="207"/></div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:50px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="Girl Followers" class="big" src="images/social_media_illustration.png" style="display: block; height: auto; border: 0; width: 423px; max-width: 100%;" title="Girl Followers" width="423"/></div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #0f1221; background-size: auto;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:10px;padding-top:50px;">
                <div style="color:#a59ee5;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:22.5px;">
                <p style="margin: 0;">Support</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-left:15px;padding-right:15px;padding-top:5px;text-align:center;width:100%;">
                <h2 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Social Media Boom!</strong></h2>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:10px;padding-top:10px;">
                <div style="color:#cdcdcd;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:24px;">
                <p style="margin: 0;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque.</p>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="button_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:10px;padding-top:10px;text-align:center;">
                <div align="center" class="alignment">
                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:146px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#5046C7" fillcolor="#5046c7"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#5046c7;border-radius:4px;width:auto;border-top:1px solid #5046C7;font-weight:400;border-right:1px solid #5046C7;border-bottom:1px solid #5046C7;border-left:1px solid #5046C7;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;">Our Instagram</span></span></a>
                <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="image_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:25px;">
                <div align="center" class="alignment" style="line-height:10px"><img alt="App" class="big" src="images/IPAD_2.png" style="display: block; height: auto; border: 0; width: 650px; max-width: 100%;" title="App" width="650"/></div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <div class="spacer_block" style="height:35px;line-height:35px;font-size:1px;"> </div>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; text-align: left; padding-top: 5px;">
                <table align="left" cellpadding="0" cellspacing="0" class="alignment" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tr>
                <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 15px; padding-right: 5px;"><img align="center" alt="Logo" class="icon" height="64" src="images/Logo_black_top.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="87"/></td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:20px;padding-top:10px;">
                <div style="font-family: sans-serif">
                <div class="" style="font-size: 12px; mso-line-height-alt: 24px; color: #000000; line-height: 2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 28px;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, </p>
                </div>
                </div>
                </td>
                </tr>
                </table>
                </td>
                <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-left:20px;text-align:center;width:100%;padding-top:5px;">
                <h1 style="margin: 0; color: #131313; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 18px; font-weight: 400; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Links</strong></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                <div style="font-family: sans-serif">
                <div class="" style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #131313;" target="_blank">Product Categories</a></p>
                </div>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                <div style="font-family: sans-serif">
                <div class="" style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #131313;" target="_blank">Stores</a></p>
                </div>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                <div style="font-family: sans-serif">
                <div class="" style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #131313;" target="_blank">Webshop</a></p>
                </div>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:20px;padding-top:10px;">
                <div style="font-family: sans-serif">
                <div class="" style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #131313;" target="_blank">Unsubscribe</a></p>
                </div>
                </div>
                </td>
                </tr>
                </table>
                </td>
                <td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
                <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-left:20px;text-align:center;width:100%;padding-top:5px;">
                <h1 style="margin: 0; color: #131313; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 18px; font-weight: 400; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Contact</strong></h1>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                <div style="font-family: sans-serif">
                <div class="" style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #000000;" target="_blank">Info@company.com</a></p>
                </div>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                <div style="font-family: sans-serif">
                <div class="" style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" rel="noopener" style="text-decoration: none; color: #131313;" target="_blank">Help Center</a></p>
                </div>
                </div>
                </td>
                </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" class="social_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:left;">
                <div class="alignment" style="text-align:left;">
                <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="144px">
                <tr>
                <td style="padding:0 4px 0 0;"><a href="https://www.example.com/" target="_blank"><img alt="Facebook" height="32" src="images/facebook2x.png" style="display: block; height: auto; border: 0;" title="facebook" width="32"/></a></td>
                <td style="padding:0 4px 0 0;"><a href="https://www.example.com/" target="_blank"><img alt="Twitter" height="32" src="images/twitter2x.png" style="display: block; height: auto; border: 0;" title="twitter" width="32"/></a></td>
                <td style="padding:0 4px 0 0;"><a href="https://www.example.com/" target="_blank"><img alt="Linkedin" height="32" src="images/linkedin2x.png" style="display: block; height: auto; border: 0;" title="linkedin" width="32"/></a></td>
                <td style="padding:0 4px 0 0;"><a href="https://www.example.com/" target="_blank"><img alt="Instagram" height="32" src="images/instagram2x.png" style="display: block; height: auto; border: 0;" title="instagram" width="32"/></a></td>
                </tr>
                </table>
                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <div class="spacer_block" style="height:25px;line-height:25px;font-size:1px;"> </div>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #5046c7;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 15px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="vertical-align: middle; color: #ffffff; font-family: inherit; font-size: 14px; text-align: center;">
                <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="alignment" style="vertical-align: middle; text-align: center;">
                <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                <!--[if !vml]><!-->
                <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                <!--<![endif]-->
                <tr>
                <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;"><img align="center" alt="" class="icon" height="16" src="images/heart-white.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="16"/></td>
                <td style="font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 14px; color: #ffffff; vertical-align: middle; letter-spacing: undefined; text-align: center;">Made With Love</td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tbody>
                <tr>
                <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 650px;" width="650">
                <tbody>
                <tr>
                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                <td class="alignment" style="vertical-align: middle; text-align: center;">
                <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                <!--[if !vml]><!-->
                <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                <!--<![endif]-->
                <tr>
                <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="https://www.designedwithbee.com/" style="text-decoration: none;" target="_blank"><img align="center" alt="Designed with BEE" class="icon" height="32" src="images/bee.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="34"/></a></td>
                <td style="font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="https://www.designedwithbee.com/" style="color: #9d9d9d; text-decoration: none;" target="_blank">Designed with BEE</a></td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table><!-- End -->
                </body>
                </html>`,
                SubjectPart: 'SES Template',
    
            },
        };
        // const result = await ses.createTemplate(parameters).promise()
        let data = {
            user_name : "Dipanshu"
        }

        let params = {
            Source: "notification@arrium.io",
            Destination: {
              ToAddresses: [
                "deepanshu4534@gmail.com"
              ],
            },
            Template: "test_template3",
            TemplateData: JSON.stringify(data)
          };
          
        let result = await new AWS.SES({region : "eu-west-1"}).sendTemplatedEmail(params).promise()
        console.log("response" , result)

    }
}