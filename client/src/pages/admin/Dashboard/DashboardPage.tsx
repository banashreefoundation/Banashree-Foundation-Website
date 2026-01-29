import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import columnsCamp from "../Campaigns/columns";
import columnsPro from "../Programs/columns";
import columnsProjects from "../Projects/columns";
import columnsContact from "../Contacts/columns"
import columns from "../Volunteer/columns";
import columnsEvent from "../Events/columns";
import { useLocation } from "react-router-dom";
import Cards from "../Card/Card";
import {
  getData,
  getAllPrograms,
  getDataProjects,
  getDataVolunteer,
} from "../Common/dataFetchFunctions";
import {ContactService} from "@/services/contactService";
import { DataTableVolunteer } from "../Volunteer/data-table-volunteer";
import { DataTableCampaigns } from "../Campaigns/data-table-campaigns";
import { DataTablePrograms } from "../Programs/data-table-programs";
import { DataTableProjects } from "../Projects/data-table-projects";
import { DataTableEvents } from "../Events/data-table-events";
import { Link } from "react-router-dom";
import { DataTableContacts } from "../Contacts/data-table-contacts";
import { arrow, rightArrowWhite, eventGroup } from "@/utils/icons";

const DashboardPage: React.FC = () => {
  const location = useLocation();

  // State for each category of data
  const [data, setData] = useState<any[]>([]);
  const [dataPro, setDataPro] = useState<any[]>([]);
  const [dataProject, setDataProject] = useState<any[]>([]);
  const [dataVol, setDataVol] = useState<any[]>([]);
  const [dataInquiry, setDataInquiry] = useState<any[]>([]);

  // Limit the data for dashboard page
  const getLimitForRoute = () =>
    location.pathname === "/admin" ? 5 : undefined;

  // Fetch data for all routes
  const fetchAllData = async (limit: number | undefined) => {
    const [
      fetchedDataCampaigns,
      fetchedDataPro,
      fetchedDataProjects,
      fetchedDataVol,
      fetchedDataInquiries
    ] = await Promise.all([
      getData(limit),
      getAllPrograms(limit),
      getDataProjects(limit),
      getDataVolunteer(limit),
      getDataContacts(limit)
    ]);

    setData(fetchedDataCampaigns);
    setDataPro(fetchedDataPro);
    setDataProject(fetchedDataProjects);
    setDataVol(fetchedDataVol);
    setDataInquiry(fetchedDataInquiries);
  };

  const getDataContacts = async (limit?: number) => {
    try {
      const response = await ContactService.getContacts({ limit });
      console.log("response", response)
      return response.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  };
  // Fetch data on page load or when the route changes
  useEffect(() => {
    const limit = getLimitForRoute();
    fetchAllData(limit);
  }, [location.pathname]);

  // Dynamically render table component based on current route
  const renderTableComponent = () => {
    switch (location.pathname) {
      case "/programs":
        return (
          <DataTablePrograms columnsPro={columnsPro} isDashboard={false} />
        );
      case "/projects":
        return (
          <DataTableProjects
            data={dataProject}
            columnsProjects={columnsProjects}
          />
        );
      case "/campaigns":
        return <DataTableCampaigns data={data} columnsCamp={columnsCamp} />;
      case "/events":
        return <DataTableEvents columns={columnsEvent} />;
      case "/volunteer":
        return <DataTableVolunteer data={dataVol} columns={columns} />;
      case "/inquiries":
        return <DataTableContacts data={dataInquiry} columnsContact={columnsContact} />;
      default:
        return null;
    }
  };

  const eventsData = [
    {
      name: "Impact Summit",
      date: "16 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Waves of Change",
      date: "18 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!.",
    },
    {
      name: "Unity Fest",
      date: "20 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Steps for Tomorrow",
      date: "12 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Beacon of Hope",
      date: "26 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Waves of Change",
      date: "28 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Impact Summit",
      date: "16 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Waves of Change",
      date: "18 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Unity Fest",
      date: "20 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Steps for Tomorrow",
      date: "12 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Beacon of Hope",
      date: "26 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
    {
      name: "Waves of Change",
      date: "28 Jan 2025",
      description:
        "Join us at our events to inspire, connect, and create lasting change!",
    },
  ];

  return (
    <>
      {renderTableComponent() !== null ? (
        <div className="flex-1">{renderTableComponent()}</div>
      ) : (
        ""
      )}
      {!renderTableComponent() && (
        <>
          <div className="flex-auto">
            <div className="pt-6 border-b">
              <div className="flex justify-between">
                <h1>Hello, Margaret</h1>
                <div className="flex items-center">
                  <span className="text-xl font-poppins-medium">
                    Today 31 January, 2025
                  </span>
                  <svg
                    className="ml-2"
                    width="41"
                    height="41"
                    viewBox="0 0 41 41"
                  >
                    <g
                      id="Group_13"
                      data-name="Group 13"
                      transform="translate(-728.952 -52.952)"
                    >
                      <g
                        id="Group_11"
                        data-name="Group 11"
                        transform="translate(729 53)"
                      >
                        <circle
                          id="Ellipse_1"
                          data-name="Ellipse 1"
                          cx="20.5"
                          cy="20.5"
                          r="20.5"
                          transform="translate(-0.048 -0.048)"
                          fill="#fdebe8"
                        />
                      </g>
                      <g
                        id="Group_12"
                        data-name="Group 12"
                        transform="translate(738.874 62.874)"
                      >
                        <path
                          id="Path_5"
                          data-name="Path 5"
                          d="M19.165,12.344h-4.7v4.7h4.7ZM18.224,2V3.881H10.7V2H8.821V3.881h-.94A1.872,1.872,0,0,0,6.009,5.761L6,18.926a1.88,1.88,0,0,0,1.881,1.881H21.045a1.88,1.88,0,0,0,1.881-1.881V5.761a1.88,1.88,0,0,0-1.881-1.881h-.94V2Zm2.821,16.926H7.881V8.582H21.045Z"
                          transform="translate(-3.179 -1.06)"
                          fill="#8b1201"
                        />
                        <path
                          id="Path_6"
                          data-name="Path 6"
                          d="M0,0H22.568V22.568H0Z"
                          fill="none"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="text-xl opacity-100 text-grey pt-2">
                Welcome to our dashboard! Explore a comprehensive overview at a
                glance.
              </div>
              <div className="flex justify-end -mt-6">
                <span className="symbols-icon mr-8"></span>
              </div>
            </div>
            <div className="homeContainer">
              <Cards />
            </div>

            <div className="flex flex-col">
              <div className="flex-1 bg-white p-4 rounded shadow mt-4">
                <div className="flex justify-between items-center mt-4">
                  <h2 className="text-lg font-bold">Programs</h2>
                  <div className="flex items-center">
                    <Link to="/programs">
                      <button className="text-[#8B1201]">View All</button>
                    </Link>
                    <img
                      src={arrow}
                      alt="icon"
                      className="w-8 h-4 ml-2"
                    />
                  </div>
                </div>
                <DataTablePrograms columnsPro={columnsPro} isDashboard={true} />
              </div>

              <div className="flex-1 bg-white p-4 rounded shadow mt-4">
                <div className="flex justify-between items-center mt-4">
                  <h2 className="text-lg font-semibold">Projects</h2>
                  <div className="flex items-center">
                    <Link to="/programs">
                      <button className="text-[#8B1201]">View All</button>
                    </Link>
                    <img
                      src={arrow}
                      alt="icon"
                      className="w-8 h-4 ml-2"
                    />
                  </div>
                </div>
                <DataTableProjects
                  columnsProjects={columnsProjects}
                  data={dataProject}
                  isDashboard={true}
                />
              </div>

              <div className="flex-1 bg-white p-4 rounded shadow mt-4">
                <div className="flex justify-between items-center mt-4">
                  <h2 className="text-lg font-semibold">Campaigns</h2>
                  <div className="flex items-center">
                    <Link to="/campaigns">
                      <button className="text-[#8B1201]">View All</button>
                    </Link>
                    <img
                      src={arrow}
                      alt="icon"
                      className="w-8 h-4 ml-2"
                    />
                  </div>
                </div>
                <DataTableCampaigns
                  columnsCamp={columnsCamp}
                  data={data}
                  isDashboard={true}
                />
              </div>

              <div className="flex-1 bg-white p-4 rounded shadow mt-4">
                <div className="flex justify-between items-center mt-4">
                  <h2 className="text-lg font-semibold">Volunteer with us</h2>
                  <div className="flex items-center">
                    <Link to="/volunteer">
                      <button className="text-[#8B1201]">View All</button>
                    </Link>
                    <img
                      src={arrow}
                      alt="icon"
                      className="w-8 h-4 ml-2"
                    />
                  </div>
                </div>
                <DataTableVolunteer
                  columns={columns}
                  data={dataVol}
                  isDashboard={true}
                />
              </div>
            </div>
          </div>

          <div className="flex-none w-[21rem] pl-4">
            <div className="group-bg w-80 h-48 mt-6">
              <div className="p-5 text-white">
                <div className="text-[18px] font-poppins-bold">
                  BANASHREE FOUNDATION IS ESTABLISED IN KARNATAKA.
                </div>
                <div className="text-[10px] pt-2 font-poppins-bold">
                  <div>NGO ID KA/2022/0319550</div>
                  <div>Registration With Sub-Registrar </div>
                  <div>NGO TYPE Trust (Non-Government) </div>
                  <div>Registration No HBN-4-00031-2022-23</div>
                </div>
                <div className="text-sm flex items-center font-poppins-medium pt-2">
                  <span>Read More</span>
                  <span className="pl-2">
                    <img src={rightArrowWhite}></img>
                  </span>
                </div>
              </div>
            </div>
            <div className="event-wrapper-card-outline bg-card pt-4 mr-3 mt-2">
              <div className="flex flex-row pl-10 content-start">
                <img
                  src={eventGroup}
                  width="91"
                  height="91"
                ></img>
                <div className="flex flex-col pl-8 pt-2 text-primary">
                  <span className="font-poppins-medium text-lg ">#Events</span>
                  <span className="font-poppins-extra-bold text-2xl text-primary-foreground">
                    134
                  </span>
                  <img
                    src={arrow}
                    alt="icon"
                    width="28"
                    height="11"
                  />
                </div>
              </div>
              <div className="hr-line-text pt-6 font-poppins-medium w-[270px] ml-4">
                <span>Upcoming Events</span>
              </div>
              <div className="pl-2 py-4 max-h-[56vh] overflow-y-auto">
                {eventsData.map((item, index) => (
                  <div
                    key={`event-${index}`}
                    className={
                      "flex flex-row font-poppins-bold " +
                      (index > 0 ? "pt-5" : "")
                    }
                  >
                    <div className="w-[80px] h-14 text-xs event-card-outline text-center pt-3">
                      {item.date}
                    </div>
                    <div className="flex flex-col pl-3">
                      <div className="text-[14px]">{item.name}</div>
                      <p className="font-poppins-regular opacity-100 text-grey text-[10px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardPage;
