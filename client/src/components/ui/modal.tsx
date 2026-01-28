import { Modal, Box, Typography } from "@mui/material";
type ShareModalType = {
  title: string;
  open?: boolean;
  cancel: string;
  width?: string;
  height?: string;
  children: React.ReactNode;
  viewAction?: boolean;
  action?: string;
  overflow?: string;
  handleClose?: () => void;
  actionCallback?: () => void;
  validateForm?: () => boolean;
  skipValidation?: boolean;
};
const SharedModal = ({
  title,
  open,
  handleClose,
  children,
  cancel,
  action,
  viewAction,
  width,
  height,
  actionCallback,
  validateForm,
  skipValidation,
}: ShareModalType) => {
  return (
    <Modal open={open} onClose={handleClose} className="mb-4 mt-4">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { width },
          height: { height },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
          padding: 0,
          overflow: "scroll",
          maxHeight: "calc(100% - 30px)",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          <div className="flex">
            <div className="w-full border-b border-[#b1afaf] p-[23px]">
              <div className="flex">
                <div
                  className="w-full font-poppins-medium text-left 
                                text-2xl tracking-normal text-[#334355]"
                >
                  {title}
                </div>
                <div className="w-7 h-7 bg-black text-white text-center rounded-full opacity-100 cursor-pointer">
                  <span
                    className="relative -top-1 font-semibold text-2xl"
                    onClick={handleClose}
                  >
                    {" "}
                    &times;{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Typography>
        <Box className="h-[calc(100%-160px)]">
          <div className="p-[23px] h-full overflow-auto">{children}</div>
        </Box>
        {!viewAction && (
          <Box>
            <div className="flex w-full items-center rounded-b-[20px] h-[82px] bg-[#FDF8F7]">
              <div className="ml-auto pr-8">
                <button
                  className="bg-transparent border border-[#212529] text-[#212529] px-4 py-2 w-[120px] rounded-lg cursor-pointer relative -left-7
                            "
                  onClick={() => {
                    handleClose();
                  }}
                >
                  {cancel}
                </button>
                <button
                  className="bg-[#480900] text-[#F7F6F6] p-[10px] w-[120px] rounded-[8px] cursor-pointer border-none"
                  onClick={() => {
                    if (validateForm && validateForm()) {
                      actionCallback();
                      handleClose();
                    } else if (skipValidation) {
                      actionCallback();
                      handleClose();
                      // Handle validation error (e.g., show a message)
                    }
                  }}
                >
                  {action}
                </button>
              </div>
            </div>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default SharedModal;
