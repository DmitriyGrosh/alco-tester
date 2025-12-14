import { reatomComponent, bindField } from "@reatom/react";
import { DatePicker, Flex, Form, InputNumber, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useBehavior } from "../model";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ModalDuration = reatomComponent<Props>(({ open, onClose }) => {
  const { t } = useTranslation();
  const { durationFields, submit } = useBehavior();

  return (
    <Modal
      okText={t("alcoForm.submit")}
      cancelText={t("alcoForm.cancel")}
      open={open}
      onCancel={onClose}
      onOk={submit}
      title={t("alcoForm.whenISober")}
    >
      <Form layout="vertical">
        <Flex gap={8} wrap="wrap">
          <Form.Item
            label={t("alcoForm.drinkingStart")}
            validateStatus={
              durationFields.start.validation().triggered &&
              durationFields.start.validation().error
                ? "error"
                : ""
            }
            help={
              durationFields.start.validation().triggered &&
              durationFields.start.validation().error
            }
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="DD.MM.YYYY HH:mm"
              {...bindField(durationFields.start)}
            />
          </Form.Item>
          <Form.Item
            label={t("alcoForm.drinkingEnd")}
            validateStatus={
              durationFields.end.validation().triggered && durationFields.end.validation().error
                ? "error"
                : ""
            }
            help={
              durationFields.end.validation().triggered && durationFields.end.validation().error
            }
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="DD.MM.YYYY HH:mm"
              {...bindField(durationFields.end)}
            />
          </Form.Item>
        </Flex>
        <Flex gap={8} wrap="wrap">
          <Form.Item
            label={t("alcoForm.weight")}
            validateStatus={
              durationFields.weight.validation().triggered &&
              durationFields.weight.validation().error
                ? "error"
                : ""
            }
            help={
              durationFields.weight.validation().triggered &&
              durationFields.weight.validation().error
            }
          >
            <InputNumber
              min={0}
              max={300}
              style={{ width: "100%", maxWidth: 100 }}
              suffix={t("units.kg")}
              {...bindField(durationFields.weight)}
            />
          </Form.Item>
          <Form.Item
            label={t("alcoForm.gender")}
            validateStatus={
              durationFields.gender.validation().triggered &&
              durationFields.gender.validation().error
                ? "error"
                : ""
            }
            help={
              durationFields.gender.validation().triggered &&
              durationFields.gender.validation().error
            }
          >
            <Select
              style={{ width: "100%", minWidth: 120 }}
              options={[
                { value: "male", label: t("alcoForm.genderMale") },
                { value: "female", label: t("alcoForm.genderFemale") },
              ]}
              {...bindField(durationFields.gender)}
            />
          </Form.Item>
          <Form.Item
            label={t("alcoForm.age")}
            validateStatus={
              durationFields.age.validation().triggered && durationFields.age.validation().error
                ? "error"
                : ""
            }
            help={
              durationFields.age.validation().triggered && durationFields.age.validation().error
            }
          >
            <InputNumber
              min={18}
              max={100}
              style={{ width: "100%" }}
              {...bindField(durationFields.age)}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
});
