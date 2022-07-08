import PreferenceServices from "../Services/PreferenceServices"


export default class PreferencesController {


    private getWeekDayNumber(weekDay : string) {
        switch (weekDay) {
            case "mon":
                return 1;
                break;
            case "tue":
                return 2;
                break;
            case "wed":
                return 3;
                break;
            case "thu":
                return 4;
                break;
            case "fri":
                return 5;
                break;
            case "sat":
                return 6;
                break;
            case "sun":
                return 7;
                break;
            default:
                break;
        }
    }

    /**
    * addPreferencesByUser
    */
    public async addPreferencesByUser(req: any, res: any) {
        let preferenceList = req.body.preferences;
        let batchSize = 25;
        let batchItemsList = [];
        let failedItems : any[] = []
        // loop through block list
        for (let i = 0; i < preferenceList.length; i++) {
            const listItem = preferenceList[i];
            // create sort key
            let sortKey = `availability#${this.getWeekDayNumber(listItem.day)}#${listItem.day}#${listItem.stationCode}`;
            // Create block item object
            let prefItem = {
                PutRequest: {
                    Item: {
                        pk: req.body.pk,
                        sk: sortKey,
                        regionID : listItem.regionId,
                        stationID : listItem.stationId,
                        bDay : listItem.day,
                        tta: listItem.tta,
                        minPay : listItem.minPay,
                        minHourlyRate : listItem.minHourlyRate,
                        bStartTime : listItem.startTime,
                        bEndTime : listItem.endTime,
                        active : listItem.active
                    },
                }
            };

            // add block item in array
            batchItemsList.push(prefItem)
            if(batchItemsList.length === batchSize || i+1 === preferenceList.length) {
                // execute batch write operation
                await new PreferenceServices().insertPreferences(batchItemsList).then(async (result: any) => {
                    batchItemsList = [] // clear batchItemsList
                    // store unprocessed (failed items)
                    failedItems.push(result.UnprocessedItems)
                    if(i+1 === preferenceList.length) {
                        res.status(200);
                        res.send({
                            success: true,
                            message: "Preferences saved successfully.",
                            data: failedItems
                        });
                    }
                }).catch((error : any) => {
                    res.status(500);
                    res.send({
                        success: false,
                        message: "Something went wrong, please try after sometime.",
                        error : error
                    });  
                })
            }  
        }        
    }

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
        await new PreferenceServices().getPreferenceByUser("UK-900001")
        .then((result : any) => {
            res.status(200);
            res.send({
              success: true,
              message: "Preferences list fetched successfully.",
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