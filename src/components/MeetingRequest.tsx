import MeetingRequestForm from "./MeetingRequestForm";
import { useEffect, useState } from "react";

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
  subAgendas: SubAgenda[];
}

const MeetingRequest = () => {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const fetchAgendas = async () => {
      try {
        const response = await fetch(
          "https://ugkznimh5b.ap-south-1.awsapprunner.com/agenda"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Agenda[] = await response.json();
        setAgendas(data);
      } catch (error) {
        setError("Failed to fetch agendas.");
        console.error("Error fetching agendas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendas();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg">Error: {error}</div>
    );
  }

  const handleFormSubmit = () => {
    setShowThankYou(true);
  };

  return (
    <div className="px-4 md:px-8 lg:px-20 flex justify-center mt-8 md:mt-12 lg:mt-18">
      {showThankYou ? (
        <div className="flex flex-col gap-4 w-full max-w-[1200px] items-center justify-center text-center h-[calc(100vh-200px)]">
          <h1 className="font-heading text-[60px]  text-[#222222]">
            Thank you
          </h1>
          <p className="text-[28px] text-[#222222] font-heading ">for Contacting us. We will get back to you soon.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-[1200px]">
          <h1 className="font-heading text-2xl md:text-4xl lg:text-[50px] text-[#222222] text-center md:text-left">
            Meeting request
          </h1>

          <MeetingRequestForm
            agendas={agendas}
            onFormSubmit={handleFormSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default MeetingRequest;
