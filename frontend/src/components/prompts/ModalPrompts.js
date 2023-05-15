function ModalPrompts({ onChangeTitle, onChangePrompt, onChangeDepartment ,onClickData, modalVisible, onCloseModal, buttonState, formError }) {
    return (
      <div>
        {/* The button to open modal */}
        <label htmlFor="my-modal" className="btn btn-secondary mt-5">
          Crea un nuevo Prompt
        </label>
  
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal" className={`modal-toggle ${modalVisible ? "checked" : ""}`} />
        <div className="modal">
          <div className="modal-box">
            <label
              htmlFor="my-modal"
              className="btn btn-sm btn-outline btn-circle absolute right-2 top-2 mt-1 mr-1"
              onClick={onCloseModal}
            >
              ✕
            </label>
            <form className="mt-5">
              <h3 className="font-semibold">Prompt Sender</h3>
              <input
                type="text"
                placeholder="Escribe el título de tu prompt "
                className="input input-bordered w-full mt-5 text-white"
                onChange={onChangeTitle}
                required
              />
              <select
                className="select select-bordered w-full text-white my-3 "
                defaultValue="Departamento"
                onChange={onChangeDepartment}
                required
              >
                <option disabled value="Departamento">
                  Departamento
                </option>
                <option>SEO</option>
                <option>PPC</option>
                <option>CRO</option>
                <option>GROWWER</option>
                <option>Analítica</option>
                <option>UX</option>
                <option>Desarrollo</option>
                <option>Otros</option>
              </select>
              <textarea
                className="textarea textarea-bordered w-full h-72 text-white my-3"
                placeholder="Escribe tu prompt aquí"
                onChange={onChangePrompt}
                required
              ></textarea>
           {formError && (
        <div className="text-red-500">
            Todos los campos son obligatorios.
        </div>
    )}
            </form>
            <div className="modal-action">
              <label htmlFor="my-modal" className="btn" onClick={onCloseModal}>
                Cerrar
              </label>
                {buttonState==="default" ? (<button className='btn btn-secondary' onClick={onClickData}> Enviar prompt</button>)
                :
                buttonState ==="loading" ? (<button className='btn btn-secondary btn-outline loading'>Loading</button>)
                :
                buttonState ==="save" && (<button className='btn btn-success'>Prompt Saved!</button>)


}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default ModalPrompts;
  