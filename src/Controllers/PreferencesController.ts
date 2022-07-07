import PreferenceServices from "../Services/PreferenceServices"


export default class PreferencesController {

    // /**
    // * addPreferencesByUser
    // */
    // public addPreferencesByUser(req: any, res: any) {
        
    // }

    /**
    * getLocation
    */
    public async getLocationByUser(req: any, res: any) {
        await new PreferenceServices().getLocationByUser("uk").then((result : any) => {
            res.status(200);
            res.send({
              success: true,
              message: "Location list fetched successfully.",
              data : result.Items
            });  
        }).catch((err: any) => {
            res.status(500);
            res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error : err
            });  
        });
    }   

    /**
    * getPreferences
    */
    public async getPreferencesByUser(req: any, res: any) {
        await new PreferenceServices().getPreferenceByUser(req.body.pk)
        .then((result : any) => {
            res.status(200);
            res.send({
              success: true,
              message: "Location list fetched successfully.",
              data : result.Items
            }); 
        }).catch((err : any) => {
            res.status(500);
            res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error : err
            });  
        });
    }

}