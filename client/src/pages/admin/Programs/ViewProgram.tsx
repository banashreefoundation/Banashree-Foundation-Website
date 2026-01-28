// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ViewProgram = ({ data }: any) => {
  const { title, tagline, detailedDescription, goals, metrics, endorsement } =
    data;
  return (
    <div className="flex">
      <div className="flex-none w-full">
        <section className="mt-[21.6px]">
          <div className="h-[130px]">
            <div className="grid grid-cols-12 gap-4">
              {/* Left Section (5 columns) */}
              <div className="col-span-12 sm:col-span-5">
                <div className="w-full h-[73px] flex-none">
                  <div className="text-[18px] text-left font-ciscosans-medium tracking-[0px] text-[#212529] opacity-100">
                    Title<sup>*</sup>
                  </div>
                  <div className="w-full h-[41px] relative top-[7px]">
                    {title}
                  </div>
                </div>
              </div>
              {/* Right Section (7 columns) */}
              <div className="col-span-12 sm:col-span-7">
                <div className="w-full h-[73px] flex-none">
                  <div className="text-[18px] text-left font-ciscosans-medium tracking-normal text-[#212529] opacity-100">
                    Tag Line<sup>*</sup>
                  </div>
                  <div className="w-full h-[41px] relative top-[7px]">
                    {tagline}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[120px]">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-12">
                <div className="w-full flex-none">
                  <div className="text-[18px] text-left font-semibold tracking-normal text-[#212529] opacity-100 font-ciscosans-medium">
                    Description<sup>*</sup>
                  </div>
                  <div className="relative top-[7px]">
                    {detailedDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="form-container-4 flex height-4">
                    <div className="media-container  media-view-container flex-none">
                        <div className="media-label">Media</div>
                        <div className="files-container">
                            <div className="files-div">
                                <div className="inner-files-div">
                                    <div className="flex padding-flex-div">
                                        <div className="icon-bar">
                                            <img src="src/assets/images/file_icon.svg" />
                                        </div>
                                        <div className="file-name">
                                            File_name.JPEG
                                        </div>
                                        <div className="size-name">
                                            Size 9.67 MB
                                        </div>
                                        <div className="down-icon">
                                            <img src="src/assets/images/down_icon.svg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="file" hidden id="file"></input>
                    </div>
                </div> */}
          <div className="h-[120px]">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-12">
                <div className="w-full flex-none">
                  <div className="text-[18px] text-left font-ciscosans-medium tracking-normal text-[#212529] opacity-100">
                    Goal<sup>*</sup>
                  </div>
                  <div className="relative h-[45px]">{goals}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[120px]">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-12">
                <div className="w-full flex-none">
                  <div className="text-[18px] text-left font-ciscosans-medium tracking-normal text-[#212529] opacity-100">
                    Metrics<sup>*</sup>
                  </div>
                  <div className="relative h-[45px]">{metrics}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[120px]">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-12">
                <div className="w-full flex-none">
                  <div className="text-[18px] text-left font-ciscosans-medium tracking-normal text-[#212529] opacity-100">
                    Endorsement<sup>*</sup>
                  </div>
                  <div className="relative h-[45px]">{endorsement}</div>
                </div>
              </div>
            </div>
          </div>

          {/*  <div className="form-container-6 flex height-6">
                    <div className="call-container flex-none">
                        <div className="call-label">Call to Action</div>
                        <div className="border-call-div">
                            <div className="inner-table-div">
                                <table border={1}>
                                    <tr>
                                        <td width="400px" className="head-td"><b>Call to Action Name</b></td>
                                        <td width="500px" className="head-td"><b>Link</b></td>
                                    </tr>
                                    <tr>
                                        <td className="text-td">Abc</td>
                                        <td className="text-td"><a href="#">https://link.com</a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div> */}
          {/* <div className="form-container-7 flex height-7">
                    <div className="tax-container flex-none">
                        <div className="tax-label">Do we need tax benefits and contact information details here ? 
                        &nbsp;&nbsp;Yes</div>
                    </div>
                </div>
                <div className="form-container-8 flex height-8">
                    <div className="details-container flex-none">
                    <div className="inner-table-div-2">
                                <table border={1}>
                                    <tr>
                                        <td width="400px" className="head-td"><b>Name</b></td>
                                        <td width="400px" className="head-td"><b>PAN Number</b></td>
                                        <td width="600px" className="head-td"><b>Address</b></td>
                                    </tr>
                                    <tr>
                                        <td className="text-td">Name</td>
                                        <td className="text-td">PAN
                                        </td>
                                        <td className="text-td">Address
                                        </td>
                                    </tr>
                                </table>
                            </div>
                    </div>
                </div> */}
        </section>
      </div>
    </div>
  );
};

export default ViewProgram;
