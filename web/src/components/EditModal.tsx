import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Modal,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useUpdateLinkMutation } from "../generated/graphql";
import InputField from "./InputField";
import { toErrorMap } from "../utils/toErrorMap";

interface editModalProps {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  idNumber: number;
}

const EditModal: React.FC<editModalProps> = ({
  onOpen,
  isOpen,
  onClose,
  idNumber,
}) => {
  const [, updateLink] = useUpdateLinkMutation();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Formik
          initialValues={{ link: "", id: idNumber, hash: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await updateLink(values);
            if (response.data?.updateLink.errors) {
              setErrors(toErrorMap(response.data.updateLink.errors));
            }

            // close modal on successful submit
            if (
              !response.data?.updateLink.errors &&
              response.data?.updateLink.link
            ) {
              onClose();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalContent>
                <ModalHeader>Edit</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                  <Box>Editing: {idNumber}</Box>
                  <InputField name="link" placeholder="link" label="" />
                  <InputField name="hash" placeholder="hash" label="" />
                </ModalBody>

                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    colorScheme="blue"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Edit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default EditModal;
