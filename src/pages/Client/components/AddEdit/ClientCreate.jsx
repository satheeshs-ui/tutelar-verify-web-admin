import { useEffect, useState, useCallback } from "react";
import { Form } from "antd";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import AntdInput from "../../../../components/ui/AntdInput";
import AntdSelect from "../../../../components/ui/AntdSelect";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../../../components/buttons/SecondaryButton";
import TestAreaField from "../../../../components/ui/TextAreaField";
import useCaseStore from "../../../../store/Case/useCaseStore";
import { useHeaderStore } from "../../../../store/Header/useHeaderStore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { clientSchema } from "../../Validation/clientSchema";

dayjs.extend(customParseFormat);
const ClientCreate = () => {
  const navigate = useNavigate();
  const { createClient } = useCaseStore();
  const { setHeader, clearHeader } = useHeaderStore();
  const [loading, setLoading] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      entityType: "individual",
      address: "",
      url: "",
    },
  });
  const [entityTypes] = useState([
    { label: "Individual", value: "individual" },
    { label: "Partnership / LLP", value: "partnership" },
    { label: "Private Limited", value: "private_limited" },
    { label: "Public Limited", value: "public_limited" },
    { label: "Sole Proprietorship", value: "sole_proprietorship" },
    { label: "Trust/NGO", value: "ngo_trust" },
  ]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        const payload = {
          name: data?.name,
          email: data?.email,
          phone: {
            countryCode: data?.mobile ? "+91" : "",
            number: data?.mobile || "",
          },
          address: data?.address,
          returnUrl: data?.url,
          entity: data?.entityType,
        };

        createClient(payload, (res) => {
          if (res) {
            setLoading(false);

            reset({
              name: "",
              email: "",
              mobile: "",

              address: "",
              url: "",

              entityType: "individual",
            });

            navigate(-1);
          }
        });
      } catch (err) {
        console.error("Create case error:", err);
      } finally {
        setLoading(false);
      }
    },
    [createClient, navigate, reset],
  );

  const onError = useCallback((err) => {
    console.error("Validation errors:", err);
  }, []);
  
  useEffect(() => {
    setHeader({
      title: "",
      actions: (
        <div className="flex gap-3">
          <div className="flex gap-3">
            <SecondaryButton
              iconLeft="cancelIcon"
              label="Cancel"
              onNotify={() => navigate(-1)}
            />
            <PrimaryButton
              iconLeft="saveicon"
              label="Save"
              onNotify={handleSubmit(onSubmit, onError)}
              disabled={loading}
            />
          </div>
        </div>
      ),
    });

    return () => clearHeader();
  }, [
    clearHeader,
    setHeader,
    navigate,
    handleSubmit,
    onSubmit,
    onError,
    loading,
  ]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mx-auto">
      <Form layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2 space-y-3">
          <div className="col-span-full font-semibold text-[#222E32] text-[14px]">
            Basic Information
          </div>

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <AntdInput
                {...field}
                label="Client Name"
                placeholder="Enter client name"
                isMandatory
                error={errors.name?.message}
                onValueChange={(data) => field.onChange(data.value)}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <AntdInput
                {...field}
                label="Email"
                isMandatory
                error={errors.email?.message}
                placeholder="Enter email"
                onValueChange={(data) => field.onChange(data.value)}
              />
            )}
          />

          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <AntdInput
                {...field}
                label="Mobile Number"
                placeholder="Enter mobile number"
                isMandatory
                onValueChange={(d) =>
                  field.onChange(d.value.replace(/\D/g, "").slice(0, 10))
                }
                error={errors.mobile?.message}
              />
            )}
          />
          <Controller
            name="entityType"
            control={control}
            render={({ field }) => (
              <AntdSelect
                label="Entity Type"
                placeholder="Select entity types"
                isMandatory
                allowClear={false}
                onClear={null}
                options={entityTypes}
                value={field.value || undefined}
                onChange={(value) => {
                  field.onChange(value);
                }}
                optionRender={(option) => (
                  <div
                    className={`flex items-center gap-2 cursor-pointer
                                        `}
                  >
                    <span>{option.label}</span>
                  </div>
                )}
                error={errors.entityType?.message}
              />
            )}
          />
          <div className=" text-[14px]">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TestAreaField
                  label="Address"
                  placeholder="Enter address"
                  value={field.value}
                  onChange={field.onChange}
                  isRequired
                  name={field.name}
                  error={errors.address?.message}
                  maxLength={400}
                />
              )}
            />
          </div>
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <AntdInput
                {...field}
                label="Webhook URL"
                placeholder="Enter url"
                prefixIcon={"linkIcon"}
                error={errors.url?.message}
                onValueChange={(data) => {
                  const value = data?.value;
                  field.onChange(value);
                }}
              />
            )}
          />
        </div>
      </Form>
    </div>
  );
};

export default ClientCreate;
