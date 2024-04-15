import { message } from "antd";
import Database from "./database/database";
import { AirModel } from "./models/airsense";

class CrudOps {
    static async Create(airdata: AirModel) {
        const newRef = await Database.database.ref().child('airdata').push();
        await newRef.set(airdata).then(response => {
            message.success('data created')
        }).catch(reason=>{
            message.error(reason);
        });

    }

    static async Read():Promise<Map<string,any>[]>{
        let mapList: Map<string, any>[] = [];
        await Database.database.ref().child('airdata').get().then(snapshot=>{

            if(snapshot.exists())
                {
                    snapshot.forEach((airdatamap) => {
                        let pushval = airdatamap.val() as Record<string, any>;
                        let val = pushval as Map<string, any>;
                        mapList.push(val);
                    });
                    

                    
                    
                }
           

        })
        return mapList;
    }
}
export default CrudOps;