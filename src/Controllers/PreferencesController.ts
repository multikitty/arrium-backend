import UserServices from "../Services/UserServices";
import PreferenceServices from "../Services/PreferenceServices"
import { LocationServices } from "../Services/LocationServices";


export default class PreferencesController {

    /**
    * addPreferencesByUser
    */
    public async addPreferencesByUser(req: any, res: any) {
        // function for getting weekday number
        const getWeekDayNumber =  (weekDay : string) => {
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
        // add preferences
        let preferenceList = req.body.preferences;
        let batchSize = 25;
        let batchItemsList = [];
        let failedItems : any[] = []
        // loop through block list
        for (let i = 0; i < preferenceList.length; i++) {
            const listItem = preferenceList[i];
            // create sort key
            let sortKey = `availability#${getWeekDayNumber(listItem.day)}#${listItem.day}#${listItem.stationCode}`;
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
    * getPreferences
    */
    public async getPreferencesByUser(req: any, res: any) {
        let data = {
            pk : req.body.pk
        }
        await new UserServices().fetchAmznFlexDetails(data).then(async (result) => {
            if(result.Item) {
                let countryCode = result.Item?.country;
                let regionCode = result.Item?.region;
                if(regionCode && countryCode) {
                    let queryParam = `${countryCode}#${regionCode}`;
                    // get data 
                    await new LocationServices().getStationList(queryParam)
                    .then(async (result : any) => {
                        if(result.Items.length > 0) {
                            let stationsData = result.Items;
                            await new PreferenceServices().getPreferenceByUser(req.body.pk)
                            .then((result : any) => {
                                let preferencesData = result.Items;
                                let responseData = [];
                                for (let i = 0; i < stationsData.length; i++) {
                                    const station = stationsData[i];
                                    if(preferencesData.length > 0) {
                                        for (let j = 0; j < preferencesData.length; j++) {
                                            const preference = preferencesData[j];
                                            if(preference.stationID === station.stationID) {
                                                let data = {
                                                    station : station,
                                                    preference : preference 
                                                }
                                                responseData.push(data);
                                            }
                                        } 
                                    } else {
                                        let data = {
                                            station : station,
                                            preference : [] 
                                        }
                                        responseData.push(data);
                                    }
                                }
                                res.status(200);
                                res.send({
                                  success: true,
                                  message: "Preferences list fetched successfully.",
                                  data : responseData
                                }); 
                            }).catch((err : any) => {
                                res.status(500);
                                res.send({
                                    success: false,
                                    message: "Something went wrong, please try after sometime.",
                                    error : err
                                });  
                            });
                        } else {
                            res.status(500);
                            res.send({
                                success: false,
                                message: "No location available.",
                            });  
                        }
                    }).catch((error) => {
                        res.status(500);
                        res.send({
                            success: false,
                            message: "Something went wrong, please try after sometime.",
                            error : error
                        });  
                    })
                } else {
                    res.status(500);
                    res.send({
                        success: false,
                        message: "Please update your flex details ssss.",
                    });  
                }
            } else {
                res.status(500);
                res.send({
                    success: false,
                    message: "Please update your flex details. ssswwwww",
                });  
            }
        }).catch((error) => {
            res.status(500);
            res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error : error
            });  
        })
    }

}