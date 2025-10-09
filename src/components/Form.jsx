import { useEffect, useState } from "react";
import { postData, updateData } from "../api/PostApi";

export const Form= ({data, setData, updateDataApi, setUpdateDataApi})=>{

    const [addData, setAddData]= useState({
        title: "",
        body: "",
    });


    let isEmpty= Object.keys(updateDataApi).length === 0;


    //get updated data and add into input field
    useEffect(()=>{
        updateDataApi && setAddData({
            title: updateDataApi.title || "",
            body: updateDataApi.body || "",
        })
    },[updateDataApi]);



    const handleInputChange= (e)=>{
        const {name,value} = e.target;
        setAddData((prev)=> ({...prev, [name]:value }));


    };

    const addPostData= async()=>{
        const res= await postData(addData);
        console.log("res",res);
        if(res.status == 201){
            setData([...data, res.data]);
            setAddData({title: "", body: "", });
        }
    };

    //update post data
    const updatePostData= async ()=>{
        try{
            const res= await updateData(updateDataApi.id, addData);
            console.log("res= ",res);

            if(res.status === 200){
                setData((prev)=>{
                    return prev.map((currElem)=>{
                        return currElem.id === res.data.id ? res.data : currElem;
                    });
                });
            }
            setAddData({title: "", body: "", });
            setUpdateDataApi({});   

        }catch(error){
            console.log(error);
        }
        
    };


    //form submission
    const handleFormSubmit= (e)=>{
        e.preventDefault();
        const action= e.nativeEvent.submitter.value; // isse uss button ki value mil jaayegi ki woh "Add" hai ya "Edit"
        if(action === "Add"){
            addPostData();
        }
        else if(action === "Edit"){
            updatePostData();
        }
    };



    return(
        <form onSubmit={handleFormSubmit} >
            <div>
                <label htmlFor="title"></label>
                    <input type="text" autoComplete="off" id="title" name="title" value={addData.title} onChange={handleInputChange} placeholder="Add Title" />
            </div>

            <div>
                <label htmlFor="body"></label>
                    <input type="text" autoComplete="off" id="body" name="body"  value={addData.body} onChange={handleInputChange} placeholder="Add Post" />
            </div>

            <button type="submit" value={isEmpty? "Add" : "Edit"} > {isEmpty? "Add" : "Edit"} </button>
        </form>
    );
};