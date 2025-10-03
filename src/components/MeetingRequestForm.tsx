import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { E164Number } from "libphonenumber-js/core";
import axios from "axios";

interface SubAgenda {
  subAgendaId: number;
  title: string;
  agendaId: number;
  order: number;
  mail: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Agenda {
  agendaId: number;
  title: string;
  mail: boolean;
  createdAt: string;
  updatedAt: string;
  subAgendas?: SubAgenda[];
}

interface MeetingRequestFormProps {
  agendas: Agenda[];
  onFormSubmit: () => void;
}

const MeetingRequestForm = ({
  agendas,
  onFormSubmit,
}: MeetingRequestFormProps) => {
  const [attendees, setAttendees] = useState([
    { name: "", email: "", department: "" },
  ]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    title: "",
    organization: "",
    phoneNumber: undefined as E164Number | undefined,
    meetingAgenda: "",
    date: "",
    selectedAgenda: "",
    selectedSubAgenda: "",
  });

  const handleAddAttendee = () => {
    if (attendees.length < 4) {
      setAttendees([...attendees, { name: "", email: "", department: "" }]);
    }
  };

  const handleAttendeeChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newAttendees = [...attendees];
    newAttendees[index] = { ...newAttendees[index], [field]: value };
    setAttendees(newAttendees);
  };

  const handleRemoveAttendee = (index: number) => {
    if (attendees.length > 1) {
      const newAttendees = attendees.filter((_, i) => i !== index);
      setAttendees(newAttendees);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAgendaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAgendaId = e.target.value;
    const selectedAgenda = agendas.find(
      (agenda) => agenda.agendaId === parseInt(selectedAgendaId)
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedAgenda: selectedAgendaId,
      meetingAgenda: selectedAgenda ? selectedAgenda.title : "",
      selectedSubAgenda: "",
    }));
  };

  const handleSubAgendaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubAgendaId = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedSubAgenda: selectedSubAgendaId,
    }));
  };

  const handlePhoneChange = (value?: E164Number) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAgendaObj = agendas.find(
      (agenda) => agenda.agendaId === parseInt(formData.selectedAgenda)
    );

    // Basic validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.title ||
      !formData.organization ||
      !formData.phoneNumber ||
      !formData.date ||
      !formData.selectedAgenda ||
      !formData.meetingAgenda ||
      ((selectedAgendaObj?.subAgendas?.length || 0) > 0 &&
        !formData.selectedSubAgenda) ||
      attendees.some((attendee) => !attendee.name || !attendee.email) // Validate attendees
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      title: formData.title,
      organization: formData.organization,
      phoneNumber: formData.phoneNumber,
      date: formData.date,
      sendEmail: true,
      agendaId: parseInt(formData.selectedAgenda),
      subAgendaId: formData.selectedSubAgenda
        ? parseInt(formData.selectedSubAgenda)
        : undefined,
      attendees: attendees.map((attendee) => ({
        name: attendee.name,
        email: attendee.email,
        department: attendee.department,
      })),
    };

    console.log("Payload:", payload);

    try {
      const response = await axios.post(
        "https://ugkznimh5b.ap-south-1.awsapprunner.com/meeting-request",
        payload
      );
      console.log("API Response:", response.data);
      onFormSubmit(); // Call the parent's submit handler on success
    } catch (error) {
      console.error("Error sending meeting request:", error);
      alert("Failed to send meeting request. Please try again.");
    }
  };

  const selectedAgendaForRender = agendas.find(
    (a) => a.agendaId === parseInt(formData.selectedAgenda)
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[766px] h-auto bg-[#afafaf4f] rounded-[25px] p-10 font-body"
    >
      <div className="flex flex-wrap justify-between gap-y-4">
        <input
          type="text"
          placeholder="Full name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full md:w-[320px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0 text-[#222222] placeholder:text-[#222222]"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full md:w-[320px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0 placeholder:text-[#222222]"
        />
      </div>
      <div className="flex flex-wrap justify-between mt-6 gap-y-4">
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full md:w-[320px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0 placeholder:text-[#222222]"
        />
        <input
          type="text"
          placeholder="Organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          className="w-full md:w-[320px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0 placeholder:text-[#222222]"
        />
      </div>
      <div className="flex flex-wrap justify-between mt-6 gap-y-4">
        <PhoneInput
          international
          defaultCountry="IN"
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Enter phone number"
          numberInputProps={{
            className:
              "w-full md:w-[280px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0",
          }}
          className="custom-phone-input"
        />
        <input
          type="date"
          placeholder="Date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full md:w-[320px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0"
        />
      </div>
      <div className="flex flex-wrap justify-between mt-6 gap-y-4">
        <div className="w-full">
          <select
            name="selectedAgenda"
            value={formData.selectedAgenda}
            onChange={handleAgendaChange}
            className="w-full py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0"
          >
            <option value="">Select Agenda</option>
            {agendas.map((agenda) => (
              <option key={agenda.agendaId} value={agenda.agendaId}>
                {agenda.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formData.selectedAgenda && (
        <div className="flex flex-wrap justify-between mt-6 gap-y-4">
          <div className="w-full">
            <select
              name="selectedSubAgenda"
              value={formData.selectedSubAgenda}
              onChange={handleSubAgendaChange}
              disabled={
                !(
                  selectedAgendaForRender?.subAgendas &&
                  selectedAgendaForRender.subAgendas.length > 0
                )
              }
              className="w-full py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0"
            >
              <option value="">
                {selectedAgendaForRender?.subAgendas &&
                selectedAgendaForRender.subAgendas.length > 0
                  ? "Select Sub Agenda"
                  : "No sub-agenda available"}
              </option>
              {selectedAgendaForRender?.subAgendas?.map((sub) => (
                <option key={sub.subAgendaId} value={sub.subAgendaId}>
                  {sub.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <h2 className="font-heading mt-18 text-[28px]">Attendees</h2>
      {attendees.map((attendee, index) => (
        <div
          key={index}
          className="flex flex-wrap justify-between mt-4 items-center gap-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full md:w-[200px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0 placeholder:text-[#222222]"
            value={attendee.name}
            onChange={(e) =>
              handleAttendeeChange(index, "name", e.target.value)
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full md:w-[200px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0 placeholder:text-[#222222]"
            value={attendee.email}
            onChange={(e) =>
              handleAttendeeChange(index, "email", e.target.value)
            }
          />
          <input
            type="text"
            placeholder="Department"
            className="w-full md:w-[200px] py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0 placeholder:text-[#222222]"
            value={attendee.department}
            onChange={(e) =>
              handleAttendeeChange(index, "department", e.target.value)
            }
          />
          {attendees.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveAttendee(index)}
              className="ml-2 text-[#222222B2] font-bold cursor-pointer"
            >
              X
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddAttendee}
        className="border border-dashed border-[##222222B2] mt-6 flex w-full items-center justify-center py-4 cursor-pointer"
        style={{
          borderWidth: "1px",
          borderSpacing: "10px",
          borderImage:
            "repeating-linear-gradient(90deg, ##222222B2 0, ##222222B2 10px, transparent 10px, transparent 20px) 1",
        }}
      >
        + Add attendee
      </button>

      <textarea
        placeholder="Additional"
        className="py-2 border-0 border-b border-b-[#222222] focus:outline-none focus:ring-0 w-full mt-6 pb-6 placeholder:text-[#222222]"
      />
      <div className="inline-flex items-center relative group mt-6 cursor-pointer rounded-full overflow-hidden">
        {/* Background overlay that slides */}
        <div className="absolute inset-0 rounded-full bg-[#EA5E20] w-0 group-hover:w-full transition-all duration-500 ease-in-out"></div>

        {/* Icon */}
        <div className="relative z-10 p-2 bg-[#EA5E20] text-white rounded-full">
          <FaArrowRight />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="relative z-10 px-4 py-2 font-medium text-[#222222] group-hover:text-white transition-colors duration-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default MeetingRequestForm;
