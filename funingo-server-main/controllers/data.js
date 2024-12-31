import Toys from '../models/toys.js'
import Party from '../models/party.js'
import Trampoline from '../models/trampoline.js'; 
import Restaurant from '../models/restaur.js'

export const restaurant= async (req, res) => {
  try {
    const newRestaurantData = new Restaurant(req.body);
    await newRestaurantData.save();
    res.status(201).json(newRestaurantData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const party= async (req, res) => {
  try {
    const newPartyData = new Party(req.body);
    await newPartyData.save();
    res.status(201).json(newPartyData);
  }
  catch(error){
    res.status(400).json({error:error.message})
  }
}

export const trampoline=async (req,res)=>{
    try{
        const newTrampolineData=new Trampoline(req.body)
        await newTrampolineData.save();
        res.status(201).json(newTrampolineData)
    }
    catch(error){
      res.status(400).json({error:error.message})
    }
}

export const toys=async(req,res)=>{
    try{
        const newToysData=new Toys(req.body)
        await newToysData.save();
        res.status(201).json(newToysData)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

