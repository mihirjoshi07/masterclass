const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course_title: {
    type: String,
    required: true,
  },
  course_description: {
    type: String,
    required: true,
  },
  course_image: {
    type: String,
    required: true,
  },
  course_price: {
    type: String,
    required: true,
  },
  detailed_description: {
    type: String,
    required: true,
  },
  reviews:[
    {
      userId:{
       type: mongoose.Schema.Types.ObjectId, // Reference to course IDs
       ref: 'users'
      },
     review_text:{
      type:String
     }
    }
  ],
  videos: [
    {
      title: {
        type: String,
        
      },
      duration: {
        type: String,
        
      },
      url: {
        type: String,
       
      },
      thumbNail:{
        type:String,
       
      }
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
