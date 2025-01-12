import { Card } from '@mui/material';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import CloseButton from '../icons/CloseIcon';


export function ModalComponent({open, setOpen, title, fullScreen, fullWidth, fullHeight, children}) {
    return (
        <Modal
            sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            open={!!open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
        >
            <section className='Container'>
            <Card className='modal' sx={{
                overflowY:'auto',
                borderRadius: '20px',
                width: {
                    xs: '90vw',
                    sm: fullScreen || fullWidth ? '90vw' : "50vw"
                },
                height: {
                    xs: '90vh',
                    sm: fullScreen || fullHeight ? '90vh' : "60vh"
                }
                    }}>
                <div className='bg-gray-100 grid grid-cols-6 p-[8px]'>
                    <h2 className='font-semibold text-lg col-span-5'>{title}</h2>
                    <div className='justify-self-end'>
                        <CloseButton onClick={() => setOpen(false)} />
                    </div>
                </div>
                {children}
            </Card>
            </section>
        </Modal>
    )
}

ModalComponent.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    handleClose: PropTypes.func,
    children: PropTypes.node,
    title: PropTypes.string,
    fullScreen: PropTypes.bool,
    fullWidth: PropTypes.bool,
    fullHeight: PropTypes.bool
}