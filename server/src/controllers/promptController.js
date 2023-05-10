const PromptModel = require('../database/schemas/prompt');
const User = require('../database/schemas/user');

const UserModel = require("../database/schemas/user");


const createPrompt = async (req,res) =>{
    
    
    try{
        const body = req.body
        const {
            prompt,
            userId

        } = body

        const user = await User.findById(userId)
        console.log(user)
        const data = {
            prompt,
            user:user._id,
            userName:user.name
            
        }    

        
        const newPrompt = new PromptModel(data)
        await newPrompt.save()
        res.status(200).json(newPrompt)
       

    }catch(err){
        return res.status(500).send({ status: "ERROR TRYCATCH CREATE", message: err });
    }

    
}


const getPromptsList = async (req, res) => {
    try {
      const prompts = await PromptModel.find()
  
      if (prompts) res.status(201).json(prompts);
      else res.status(404).send({ status: "ERROR", message: "Prompts not found" });
    } catch (error) {
      return res.status(500).send({ status: "ERROR TRYCATCH List", message: error });
    }
  };


  const updatePrompt = async (req, res) => {
    try {
      const { id } = req.params;
      const prompt = await PromptModel.findByIdAndUpdate(id, req.body);
      if (prompt) res.status(200).json(prompt);
      else res.status(404).send({ status: "ERROR", message: "Prompt not Found. Not Updated" });
    } catch (error) {
      return res.status(500).send({ status: "ERROR TRYCATCH UPDATE", message: error });
    }
  };

  const deletePrompt = async (req, res) => {
    try {
      const prompt = await PromptModel.findByIdAndDelete(req.params.id);
      if (prompt) {
        res.status(200).json(prompt);
      } else res.status(404).send({ status: "ERROR", message: "prompt not Found. Not Deleted." });
    } catch (error) {
      return res.status(500).send({ status: "ERROR TRYCATCH DELETE", message: error });
    }
  };


module.exports={
    createPrompt,
    getPromptsList,
    updatePrompt,
    deletePrompt
}