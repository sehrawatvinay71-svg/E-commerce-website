import "./Modal.css";
function Modal({show, onClose,children}) {
    if (show === false){
        return null;
    }
    return(
        <div className="backdrop" onClick={onClose}>
            <div className="modal">
                {children}
            </div>
        </div>
    )
}

export default Modal;