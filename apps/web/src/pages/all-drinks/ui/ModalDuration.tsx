import { reatomComponent, bindField } from "@reatom/react";
import { DatePicker, Flex, Form, InputNumber, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import { durationFormAtom } from "../model";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ModalDuration = reatomComponent<Props>(({ open, onClose }) => {
  const { t } = useTranslation();
  const { fields, submit } = durationFormAtom;

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
              fields.start.validation().triggered && fields.start.validation().error
                ? "error"
                : ""
            }
            help={
              fields.start.validation().triggered &&
              fields.start.validation().error
            }
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="DD.MM.YYYY HH:mm"
              {...bindField(fields.start)}
            />
          </Form.Item>
          <Form.Item
            label={t("alcoForm.drinkingEnd")}
            validateStatus={
              fields.end.validation().triggered && fields.end.validation().error
                ? "error"
                : ""
            }
            help={
              fields.end.validation().triggered && fields.end.validation().error
            }
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="DD.MM.YYYY HH:mm"
              {...bindField(fields.end)}
            />
          </Form.Item>
        </Flex>
        <Flex gap={8} wrap="wrap">
          <Form.Item
            label={t("alcoForm.weight")}
            validateStatus={
              fields.weight.validation().triggered &&
              fields.weight.validation().error
                ? "error"
                : ""
            }
            help={
              fields.weight.validation().triggered &&
              fields.weight.validation().error
            }
          >
            <InputNumber
              min={0}
              max={300}
              style={{ width: "100%", maxWidth: 100 }}
              suffix={t("units.kg")}
              {...bindField(fields.weight)}
            />
          </Form.Item>
          <Form.Item
            label={t("alcoForm.gender")}
            validateStatus={
              fields.gender.validation().triggered &&
              fields.gender.validation().error
                ? "error"
                : ""
            }
            help={
              fields.gender.validation().triggered &&
              fields.gender.validation().error
            }
          >
            <Select
              style={{ width: "100%", minWidth: 120 }}
              options={[
                { value: "male", label: t("alcoForm.genderMale") },
                { value: "female", label: t("alcoForm.genderFemale") },
              ]}
              {...bindField(fields.gender)}
            />
          </Form.Item>
          <Form.Item
            label={t("alcoForm.age")}
            validateStatus={
              fields.age.validation().triggered && fields.age.validation().error
                ? "error"
                : ""
            }
            help={
              fields.age.validation().triggered && fields.age.validation().error
            }
          >
            <InputNumber
              min={18}
              max={100}
              style={{ width: "100%" }}
              {...bindField(fields.age)}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
});
