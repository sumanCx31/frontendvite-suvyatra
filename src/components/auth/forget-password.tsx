import { useForm, type SubmitHandler } from "react-hook-form";
import { EmailInput } from "../formInput/formInput";

export interface ICrediential{
    email:string;
}

const ForgetPassword = () => {
    const {control,handleSubmit,formState:{errors,isSubmitting}} = useForm<ICrediential>({
        defaultValues:{
            email:""
        }
    });
    const onSubmit:SubmitHandler<ICrediential> = async (data) => {
        console.log(data);
        console.log("Email for password reset sent");
    };
  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in-up">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Forget Page</h2>
          <p className="text-slate-400 mt-2">
            Enter your email or phone number to receive password reset
            instructions
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
              Email or Phone
            </label>
            <EmailInput
                control={control}
                name={"email"}
                errMsg={errors?.email?.message as string}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.email.message}
              </p>
            )}

          </div>

          {/* Submit */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60
              text-slate-900 font-bold rounded-2xl transition-all transform
              hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Send Reset Instructions
          </button>
        </form>
      </div>
    </div>
  );
};
export default ForgetPassword;
