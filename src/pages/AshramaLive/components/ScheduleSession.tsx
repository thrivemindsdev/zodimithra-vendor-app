import { useRef, useState } from "react";
import { useCreateAshramaLiveSessionMutation } from "../../../redux/api/ashramamLiveApi";

type FormData = {
  title: string;
  date: string;
  time: string;
  description: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  title: "",
  date: "",
  time: "",
  description: "",
};

const ScheduleSession = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});

  const [dateType, setDateType] = useState<"text" | "date">("text");
  const [timeType, setTimeType] = useState<"text" | "time">("text");

  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const [createLiveSession, { isLoading }] =
    useCreateAshramaLiveSessionMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!form.title.trim()) {
      newErrors.title = "Session title is required";
    }

    if (!form.date) {
      newErrors.date = "Please select a date";
    }

    if (!form.time) {
      newErrors.time = "Please select a time";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description should be at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validate()) return;

    try {
      await createLiveSession({
        mode: "scheduled",
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        start_time: `${form.date}T${form.time}:00`,
      }).unwrap();

      alert(`✨ Session "${form.title.trim()}" scheduled successfully!`);
    } catch (err: any) {
      console.error("Failed to schedule session", err);
      alert(
        err?.data?.message ||
          "Could not schedule the session. Please try again.",
      );
    } finally {
      setForm(initialForm);
      setErrors({});
      setDateType("text");
      setTimeType("text");
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl mt-4 lg:mt-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Schedule Future Session
        </h2>

        <span
          onClick={() => {
            setErrors({});
            setForm(initialForm);
          }}
          className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-medium text-indigo-600 hover:cursor-pointer"
        >
          Reset
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Session Title */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            Session Title
          </label>

          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="E.G. Shani Transit Special 2026"
            className={`w-full h-10 rounded-lg bg-[#F5EDE3] placeholder:text-sm px-3 text-sm outline-none border ${
              errors.title ? "border-red-500" : "border-transparent"
            }`}
          />

          {errors.title && (
            <p className="text-red-500 text-[11px] mt-1">{errors.title}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold mb-1">Date</label>

            <div className="relative">
              <input
                ref={dateRef}
                name="date"
                type={dateType}
                value={form.date}
                placeholder="dd-mm-yyyy"
                onChange={handleChange}
                onFocus={() => {
                  if (dateType === "text") {
                    setDateType("date");

                    setTimeout(() => {
                      dateRef.current?.showPicker?.();
                    }, 0);
                  }
                }}
                onBlur={() => {
                  if (!form.date) {
                    setDateType("text");
                  }
                }}
                className={`w-full h-10 rounded-lg bg-[#F5EDE3] placeholder:text-sm px-3 pr-10 outline-none border ${
                  errors.date ? "border-red-500" : "border-transparent"
                }`}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                📅
              </span>
            </div>

            {errors.date && (
              <p className="text-red-500 text-[11px] mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-semibold mb-1">Time</label>

            <div className="relative">
              <input
                ref={timeRef}
                name="time"
                type={timeType}
                value={form.time}
                placeholder="--:--"
                onChange={handleChange}
                onFocus={() => {
                  if (timeType === "text") {
                    setTimeType("time");

                    setTimeout(() => {
                      timeRef.current?.showPicker?.();
                    }, 0);
                  }
                }}
                onBlur={() => {
                  if (!form.time) {
                    setTimeType("text");
                  }
                }}
                className={`w-full h-10 rounded-lg bg-[#F5EDE3] placeholder:text-sm px-3 pr-10 outline-none border ${
                  errors.time ? "border-red-500" : "border-transparent"
                }`}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                🕒
              </span>
            </div>

            {errors.time && (
              <p className="text-red-500 text-[11px] mt-1">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe What You'll Cover..."
            className={`w-full h-20 resize-none rounded-lg bg-[#F5EDE3] placeholder:text-sm p-3 outline-none border ${
              errors.description ? "border-red-500" : "border-transparent"
            }`}
          />

          {errors.description && (
            <p className="text-red-500 text-[11px] mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 rounded-xl text-white bg-linear-to-b from-[#7d2f30] to-[#9b3832] hover:opacity-95 transition hover:cursor-pointer"
        >
          Schedule Session
        </button>
      </form>
    </div>
  );
};

export default ScheduleSession;
