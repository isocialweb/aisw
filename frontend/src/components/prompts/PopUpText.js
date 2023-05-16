// PopUpText Component
export default function PopUpText({ id, contenido }) {
  return (
    <div>
      <label htmlFor={`my-modal-${id}`} className="btn btn-primary ">ver Prompt</label>

      <input type="checkbox" id={`my-modal-${id}`} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box overflow-x-hidden">
          <label htmlFor={`my-modal-${id}`} className="btn btn-sm btn-outline btn-circle absolute right-2 top-2">✕</label>
          <p className="whitespace-normal text-center font-normal m-5">{contenido}</p>
        </div>
      </div>
    </div>
  );
}
