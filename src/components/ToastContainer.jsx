import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/toastSlice';

const CustomToastContainer = () => {
  const toasts = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (toasts.length > 0) {
      const { type, message } = toasts[0];
      toast[type](message, {
        onClose: () => dispatch(removeToast()),
      });
    }
  }, [toasts, dispatch]);

  return <ToastContainer />;
};

export default CustomToastContainer;
