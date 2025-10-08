import { useEffect, useState } from "react";
import { deletePost, getPost } from "../api/PostApi";
import { Form } from "./Form";

export const Post = () => {
    const [data, setData] = useState([]);
    const [updateDataApi, setUpdateDataApi]= useState({});

    // function to get post
    const getPostData = async () => {
        const res = await getPost();
        console.log(res);
        setData(res.data);

    };  


    //function to delete post
    const handleDeletePost = async (id) => {

        try {
            const res = await deletePost(id);
            if (res.status == 200) {
                const newUpdatedPosts = data.filter((currPost) => {
                    return currPost.id !== id;
                });
                setData(newUpdatedPosts);


                ///This below check is for situation jb, suppose maine kisi post ko edit dbaaya and then delete dbaa diya,
                /// bina iss condition ke uska data input field mei rh jara tha or jbb "Edit" dbaa rhe thee input field mei toh api mei add bhi nhi hora tha, error dera tha
                /// after this condition, agar delete krne ke baad woh same id ka data input field mei hota hai toh woh input field clear kr deta hai
                if(updateDataApi.id === id){ 
                    setUpdateDataApi({});
                }

            }
            else {
                console.log("Failed to delete the post: ", res.status);
            }

        } catch (error) {
            console.log(error);
        }

    };

    //handleUpdatePost
    const handleUpdatePost= (currElem)=> setUpdateDataApi(currElem);



    useEffect(() => {
        getPostData();
    }, []);

    return (
        <>
        <section className="editor">
            <Form data={data} setData={setData} updateDataApi={updateDataApi} setUpdateDataApi={setUpdateDataApi} />
        </section>
            <section className="section-post">
                <ol>
                    {data.map((currElem) => {
                        const { id, title, body } = currElem;
                        return <li key={id}>
                            <div className="content-wrapper">
                                <p>{title}</p>
                                <p>{body}</p>

                            </div>
                            <div className="button-group">
                                <button onClick={()=> handleUpdatePost(currElem)}>Edit</button>
                                <button className="btn-delete" onClick={() => handleDeletePost(id)} >Delete</button>

                            </div>
                        </li>
                    })}
                </ol>
            </section>
        </>
    );
};