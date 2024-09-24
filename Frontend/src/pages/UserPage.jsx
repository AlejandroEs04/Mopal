import React from 'react'
import useAuth from '../hooks/useAuth'
import Input from '../components/Input';
import Textarea from '../components/Textarea';

const UserPage = () => {
    const { auth } = useAuth();

    return (
        <div className='mt-2'>
            <h1 className='m-0'>Porfile Information</h1>
            <p>See your porfile information, and setting your system</p>

            <div className='row g-5'>
                <div className='col-md-8'>
                    <h3>Personal information</h3>

                    <form className='d-flex flex-column gap-2'>
                        <Input label={'Name'} name={'Name'} value={auth.Name} disable />
                        <Input label={'Last name'} name={'LastName'} value={auth.LastName} disable />
                        <Input label={'Email'} name={'Email'} value={auth.Email} disable />
                        <Input label={'Password'} name={'Password'} placeholder={'New Password'} />

                        <button
                            type='button'
                            className='btn btn-primary'
                        >
                            Guardar Cambios
                        </button>
                    </form>
                    
                    <h3 className='mt-3'>System information</h3>
                    <p className='m-0'><span className='fw-bold'>User Name: </span>{auth.UserName}</p>
                    <p className='m-0'><span className='fw-bold'>Rol: </span>{auth.RolName}</p>
                </div>

                <div className='col-md-4 text-end bg-secondary rounded py-3 text-light shadow'>
                    <h3 className='m-0'>Personalization</h3>
                    <p>You can set your preferences for the system</p>

                    {(auth.RolID === 1 || auth.RolID === 3) && (
                        <div>
                            <Textarea 
                                label={'Terms and conditions'}
                                name={'TermsAndConditions'}
                            />

                            <p className='fw-light mt-2 m-0'>This informations will be on your quotations or sales</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default UserPage