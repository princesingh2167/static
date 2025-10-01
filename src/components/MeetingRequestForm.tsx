import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { E164Number } from "libphonenumber-js/core";
import axios from "axios";

interface Agenda {
  agendaId: number;
  title: string;
  mail: boolean;
  createdAt: string;
  updatedAt: string;
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
    { fullName: "", email: "", department: "" },
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
  });

  const handleAddAttendee = () => {
    if (attendees.length < 4) {
      setAttendees([...attendees, { fullName: "", email: "", department: "" }]);
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
    }));
  };

  const handlePhoneChange = (value?: E164Number) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      attendees.some((attendee) => !attendee.fullName || !attendee.email) // Validate attendees
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      requesterName: formData.fullName,
      requesterEmail: formData.email,
      title: formData.meetingAgenda,
      organisation: formData.organization,
      requesterDesignation: "Laborum nobis adipis", // Hardcoded from user's payload
      requesterPhone: formData.phoneNumber,
      description: formData.meetingAgenda,
      preferredDate: formData.date,
      preferredTime: "02:30:00", // Hardcoded from user's payload
      attendees: attendees.map((attendee) => ({
        fullName: attendee.fullName,
        email: attendee.email,
        department: attendee.department,
      })),
      additionalNotes: "", // Not explicitly in form, so empty string
      requestStatus: "REQUESTED",
      plantId: "8b104d74-0548-4d7f-84ad-b90db43e5340", // Hardcoded from user's payload
      agendaId: parseInt(formData.selectedAgenda), // Add agendaId from form
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
            value={attendee.fullName}
            onChange={(e) =>
              handleAttendeeChange(index, "fullName", e.target.value)
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
