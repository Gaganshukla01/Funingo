import RedeemCoinHistory from "../models/redeem_tracking.js";

export const redeemadd=async(req,res)=>{
    try{
        
        const {redeemBy,redeemOff,coins,activity}=req.body;
        if(!redeemBy && !redeemOff && !coins && !activity){
            return res.json({success:false,message:"All Field Required.."})
        }
        const newHistory=new RedeemCoinHistory({
            redeemBy,
            redeemOff,
            coins,
            activity
        })
         await newHistory.save()
         return res.json({success:true,message:newHistory})
    }
    catch(error){
        return res.json({sucess:false,message:error})
    }
}

export const redeemFetch = async (req, res) => {
    try {
        const data = await RedeemCoinHistory.find({});
        
        if (data && data.length > 0) {
            return res.json({ success: true, message: "Data fetched successfully", data: data });
        }
        return res.json({ success: true, message: "No data found", data: [] });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

