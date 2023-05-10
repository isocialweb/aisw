  
  export default function PopUpText(props) {
    return (
      <div>
        
<label htmlFor="my-modal-3" className="btn btn-primary ">ver Prompt</label>

{/* Put this part before </body> tag */}
<input type="checkbox" id="my-modal-3" className="modal-toggle" />
<div className="modal">
  <div className="modal-box overflow-x-hidden">
    <label htmlFor="my-modal-3" className="btn btn-sm btn-outline btn-circle absolute right-2 top-2">✕</label>
    <p className="whitespace-normal text-center font-normal m-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ea odio, quasi dignissimos facere laudantium ad delectus ipsum eveniet, veniam, nesciunt nam enim omnis repudiandae natus molestiae beatae unde dolores.</p>
      
    
   
    
  </div>
</div>

      </div>
    );
  }