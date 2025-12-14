import { reatomComponent } from "@reatom/react";
import { DatePicker, Flex, Form, InputNumber, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ModalDuration = reatomComponent<Props>(({ open, onClose }) => {
  const { t } = useTranslation();
  return (
    <Modal
      okText={t("alcoForm.submit")}
      cancelText={t("alcoForm.cancel")}
      open={open}
      onCancel={onClose}
      title={t("alcoForm.whenISober")}
    >
      <Form layout="vertical">
        <Flex gap={8} wrap="wrap">
          <Form.Item label={t("alcoForm.drinkingStart")} name="start">
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="DD.MM.YYYY HH:mm"
            />
          </Form.Item>
          <Form.Item label={t("alcoForm.drinkingEnd")} name="end">
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="DD.MM.YYYY HH:mm"
            />
          </Form.Item>
        </Flex>
        <Flex gap={8} wrap="wrap">
          <Form.Item label={t("alcoForm.weight")} name="weight">
            <InputNumber
              min={0}
              max={300}
              style={{ width: "100%", maxWidth: 100 }}
              suffix={t("units.kg")}
            />
          </Form.Item>
          <Form.Item label={t("alcoForm.gender")} name="gender">
            <Select
              style={{ width: "100%", minWidth: 120 }}
              options={[
                { value: "male", label: t("alcoForm.genderMale") },
                { value: "female", label: t("alcoForm.genderFemale") },
              ]}
            />
          </Form.Item>
          <Form.Item label={t("alcoForm.age")} name="age">
            <InputNumber min={18} max={100} style={{ width: "100%" }} />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
});
