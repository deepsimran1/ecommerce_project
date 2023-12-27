// // const API_URL = "https://noteyard-backend.herokuapp.com"
// // const UPLOAD_ENDPOINT = "api/blogs/uploadImg";
// // function uploadAdapter(loader){
// //   return({
// //     upload :() =>{
// //       return new Promise ((resolve, reject)=>{
// //         const body = new FormData ();
// //         loader.file.then((file)=>{
// //           body.append("uploading",file);
// //           fetch(`${API_URL}/${UPLOAD_ENDPOINT}`,{
// //             method:"post",
// //             body:body
// //           })
// //           .then((res=> res.json()))
// //             .then((res)=>{
// //               resolve({default : `${API_URL}/${res.url}`})
// //             })
// //             .catch((err)=>{
// //               reject(err);
// //             })
            
// //           })
// //         })
// //       }
// //     })
// //   }


// //   function uploadPlugin(editor){
// //     editor.plugins.get("FileRepository").createUploadAdapter = (loader)=>{
// //       return uploadAdapter(loader);
// //     }
// //   }


// config={{
//     extraPlugins:[uploadPlugin]
//   }}