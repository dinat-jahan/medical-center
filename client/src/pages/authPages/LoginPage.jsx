import LoginForm from "../../components/LoginForm";

const LoginPage = () => (
  <dialog
    id="login_modal"
    className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
  >
    <div className="modal-box relative p-0 max-w-md">
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        aria-label="Close"
        onClick={() => document.getElementById("login_modal").close()}
      >
        ✕
      </button>
      <LoginForm />
    </div>
  </dialog>
);

export default LoginPage;
