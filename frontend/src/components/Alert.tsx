interface IAlertProps {
  alert: {
    heading: string;
    message: string;
    color?: string;
  };
}

function Alert({ alert }: IAlertProps) {
  return (
    <div
      className={`alert-box ${
        alert.color === undefined
          ? "bg-[#ece9f6] border-purple"
          : "border-red bg-[#eee2e4]"
      } border-l-4  shadow-2xl text-gray-700 border p-4 rounded-lg`}
      role="alert"
    >
      <p className="font-bold mb-1 text-lg">{alert.heading}</p>
      <p className="font-semibold">{alert.message}</p>
    </div>
  );
}

export default Alert;
