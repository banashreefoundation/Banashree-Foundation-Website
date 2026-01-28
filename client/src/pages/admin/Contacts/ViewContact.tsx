import { Contact } from "@/types/contact.types";

interface ViewContactProps {
  data: Contact;
}

const ViewContact = ({ data }: ViewContactProps) => {
  const {
    name,
    email,
    phone,
    inquiryType,
    subject,
    message,
    status,
    notes,
    createdAt,
    resolvedAt,
    resolvedBy,
  } = data;

  const InfoRow = ({
    label,
    value,
    required = false,
  }: {
    label: string;
    value: React.ReactNode;
    required?: boolean;
  }) => (
    <div className="mb-6">
      <div className="text-[18px] font-ciscosans-medium text-[#212529] mb-2">
        {label}
        {required && <sup>*</sup>}
      </div>
      <div className="text-[16px] text-gray-700">{value}</div>
    </div>
  );

  const formatInquiryType = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      general: "General Inquiry",
      partnership: "Partnership Opportunity",
      volunteer: "Volunteer Information",
      donation: "Donation Support",
      other: "Other",
    };
    return typeLabels[type] || type;
  };

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <InfoRow label="Name" value={name} required />
          <InfoRow
            label="Email"
            value={
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
            }
            required
          />
          <InfoRow label="Phone" value={phone || "N/A"} required />
        </div>

        {/* Right Column */}
        <div>
          <InfoRow
            label="Inquiry Type"
            value={formatInquiryType(inquiryType)}
            required
          />
          <InfoRow
            label="Status"
            value={
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                  status === "new"
                    ? "bg-blue-100 text-blue-800"
                    : status === "in-progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "resolved"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {formatStatus(status)}
              </span>
            }
          />
          <InfoRow label="Created At" value={formatDate(createdAt)} />
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="mt-4">
        <InfoRow label="Subject" value={subject} required />
        <InfoRow
          label="Message"
          value={<div className="whitespace-pre-wrap">{message}</div>}
          required
        />

        {notes && (
          <InfoRow
            label="Notes"
            value={
              <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                {notes}
              </div>
            }
          />
        )}

        {resolvedAt && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Resolution Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow label="Resolved At" value={formatDate(resolvedAt)} />
              {resolvedBy && (
                <InfoRow
                  label="Resolved By"
                  value={
                    <div>
                      <div className="font-semibold">{resolvedBy.name}</div>
                      <div className="text-sm text-gray-600">
                        {resolvedBy.email}
                      </div>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="flex gap-3">
            <a
              href={`mailto:${email}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Acknowledge
            </a>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
               Reject
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContact;