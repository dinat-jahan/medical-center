import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
const LoginPage = () => {
  return (
    <div>
      <dialog id="login_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <LoginForm />
        </div>
      </dialog>
    </div>
  );
};

export default LoginPage;
