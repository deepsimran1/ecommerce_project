const Contact = require('../models/contact');

const contactController={
    addcontent: async (req, res) => {
        try {
            console.log("req.body", req.body);
            const { description,type } = req.body;
      let payload=req.body
      console.log('payload', payload)
            const existingPolicy = await Contact.findOne({type:type});
            console.log('description', description)
            if (existingPolicy) {
              
                await Contact.findByIdAndUpdate({ _id: existingPolicy._id }, payload);
                res.status(200).json({ message: 'Privacy Policy Updated' });
            } else {
              const newPrivacyPolicy = new Contact( payload );
              await newPrivacyPolicy.save();
              res.status(201).json({ message: 'Privacy Policy Saved' });
            }
          } catch (error) {
            console.error('Error saving policy', error);
            res.status(500).json({ message: 'Error saving policy' });
          }
        },
      getcontent: async(req, res)=>{
        try{
            let {type}=req.query

            const policy = await Contact.findOne({type:type});
            console.log("policy",policy);
            if(policy){
                res.status(200).json({Content: policy});
            }else{
                res.status(404).json({message: 'Privacy policy not found'});
            }
        }catch(error){
            console.error("Error getting provacy policy",error);
            res.status(500).json({message:"Error getting privacy policy"});
        }
      }
}

module.exports = contactController;
