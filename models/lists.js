const mongoose =require("mongoose");

const Schema=mongoose.Schema;

const ListSchema =new Schema({
    title:{
        type :String ,
        required:true,
    },
    description:String,
    image:{
        type:Object,
        
        // set:((v)=>{
        //    v===""? "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0":v[url]; 
        // })
    },
    price:Number,
    location:String,
    country:String,
});

const List =mongoose.model("List",ListSchema);

module.exports=List;