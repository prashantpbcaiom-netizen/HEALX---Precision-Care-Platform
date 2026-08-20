import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Star,
  Clock,
  User,
  CheckCircle2,
  Video,
  Building2,
  Sparkles,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Specialist, Appointment, ActiveView } from '../types';

interface ScheduleAppointmentProps {
  specialists: Specialist[];
  onAddAppointment: (appointment: Appointment) => void;
  setActiveView: (view: ActiveView) => void;
  onOpenAIAssistant: () => void;
}

export const ScheduleAppointment: React.FC<ScheduleAppointmentProps> = ({
  specialists,
  onAddAppointment,
  setActiveView,
  onOpenAIAssistant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedLocation, setSelectedLocation] = useState('Central Clinic');
  const [selectedDate, setSelectedDate] = useState('2023-10-24');
  
  // Selected Specialist for booking
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(
    specialists[0] || {
      id: 'doc-1',
      name: 'Dr. Marcus Chen',
      title: 'Senior Cardiologist',
      department: 'Cardiology',
      rating: 4.9,
      reviewCount: 124,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      bio: 'Specializes in preventative cardiology and heart failure management. Over 15 years of clinical experience.',
      nextAvail: 'Today, 2:30 PM',
      location: 'Central Clinic',
      mode: 'In-Person',
      fee: 150.00,
      availableTimes: ['09:00 AM', '10:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
    }
  );

  const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:30 PM');
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);

  // Filter specialists
  const filteredSpecialists = specialists.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDept === 'All Departments' || s.department === selectedDept;

    const matchesLoc =
      selectedLocation === 'All Locations' ||
      s.location.includes(selectedLocation) ||
      (selectedLocation === 'Telehealth' && (s.mode === 'Telehealth' || s.mode === 'Both'));

    return matchesSearch && matchesDept && matchesLoc;
  });

  const handleConfirmBooking = () => {
    setIsBookingConfirmed(true);
    
    // Trigger confetti celebration!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#0284c7', '#10b981', '#38bdf8'],
      });
    } catch {
      // ignore
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      date: 'Today, Oct 24, 2023',
      time: `${selectedTimeSlot} - ${getEndTime(selectedTimeSlot)}`,
      providerName: selectedSpecialist.name,
      department: selectedSpecialist.department,
      providerAvatar: selectedSpecialist.image,
      type: selectedSpecialist.mode === 'Telehealth' ? 'Telehealth' : 'In-Person',
      status: 'Confirmed',
      location: selectedSpecialist.location,
      patientName: 'Alex Vance',
    };

    onAddAppointment(newApt);
    setBookingSuccessModal(true);
  };

  const getEndTime = (start: string) => {
    if (start === '02:30 PM') return '03:15 PM';
    if (start === '09:00 AM') return '09:45 AM';
    if (start === '11:00 AM') return '11:45 AM';
    if (start === '04:00 PM') return '04:45 PM';
    return '01:00 PM';
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 relative">
      {/* Top Search Bar (matching screenshot 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Schedule Appointment
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            Find the right specialist and book your visit instantly.
          </p>
        </div>

        {/* Global Specialist Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-specialists"
            placeholder="Search specialists, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Filter Bar (Department, Location, Availability) */}
      <div
        id="card-appointment-filters"
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Department dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
            Department
          </label>
          <select
            id="select-department-filter"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="All Departments">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="General Practice">General Practice</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
          </select>
        </div>

        {/* Location dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
            Location
          </label>
          <div className="relative">
            <select
              id="select-location-filter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
            >
              <option value="Central Clinic">Central Clinic</option>
              <option value="Westside Medical Hub">Westside Medical Hub</option>
              <option value="Telehealth">Telehealth / Remote</option>
              <option value="All Locations">All Locations</option>
            </select>
            <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Availability Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
            Availability
          </label>
          <div className="relative">
            <input
              type="date"
              id="input-availability-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Available Specialists (Left 8 cols) & Booking Summary (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Available Specialists List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Available Specialists</h2>
            <span className="text-xs text-slate-500 font-mono">
              {filteredSpecialists.length} doctors found
            </span>
          </div>

          <div className="space-y-4">
            {filteredSpecialists.map((specialist) => {
              const isSelected = selectedSpecialist.id === specialist.id;

              return (
                <div
                  key={specialist.id}
                  id={`card-specialist-${specialist.id}`}
                  onClick={() => setSelectedSpecialist(specialist)}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col sm:flex-row gap-5 cursor-pointer relative ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-md'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Doctor photo avatar */}
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-xs shrink-0 self-start"
                  />

                  {/* Doctor info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">
                          {specialist.name}
                        </h3>
                        <p className="text-xs font-semibold text-cyan-700 font-mono">
                          {specialist.title}
                        </p>
                      </div>

                      {/* Rating pill */}
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-900 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{specialist.rating}</span>
                        <span className="text-amber-700/80 font-normal">
                          ({specialist.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {specialist.bio}
                    </p>

                    {/* Tag badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-cyan-600" />
                        <span>Next Avail: {specialist.nextAvail}</span>
                      </span>

                      <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono flex items-center gap-1.5">
                        {specialist.mode === 'Telehealth' ? (
                          <>
                            <Video className="w-3 h-3 text-cyan-600" />
                            <span>Telehealth</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span>{specialist.location}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Booking Summary Card */}
        <div className="lg:col-span-5">
          <div
            id="card-booking-summary"
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6 sticky top-20"
          >
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Booking Summary
            </h2>

            {/* Selected Specialist */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">
                  Selected Specialist
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {selectedSpecialist.name}
                </p>
                <p className="text-xs text-slate-500">{selectedSpecialist.department}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">
                  Location
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {selectedSpecialist.location}
                </p>
                <p className="text-xs text-slate-500">Suite 402 • Check-in Kiosk 2</p>
              </div>
            </div>

            {/* Select Time slot buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900">Select Time</p>
                <p className="text-xs text-slate-500 font-mono">Today, Oct 24</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {['09:00 AM', '10:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'].map((slot) => {
                  const isCrossed = slot === '10:30 AM';
                  const isSelected = selectedTimeSlot === slot && !isCrossed;

                  return (
                    <button
                      key={slot}
                      type="button"
                      id={`btn-timeslot-${slot.replace(/\s+/g, '')}`}
                      disabled={isCrossed}
                      onClick={() => !isCrossed && setSelectedTimeSlot(slot)}
                      className={`py-2 px-1 text-center text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        isCrossed
                          ? 'line-through bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : isSelected
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-500/20 font-extrabold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consultation Fee */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Consultation Fee</span>
              <span className="text-lg font-extrabold text-slate-900 font-mono">
                ${selectedSpecialist.fee.toFixed(2)}
              </span>
            </div>

            {/* Confirm Button */}
            <button
              id="btn-confirm-appointment-booking"
              type="button"
              onClick={handleConfirmBooking}
              className="w-full py-3.5 px-4 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm Booking</span>
              <span className="text-base font-bold">→</span>
            </button>

            <p className="text-[11px] text-center text-slate-400 font-medium">
              Free cancellation up to 24h before.
            </p>
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Bot Bubble (as seen in screenshot 2 bottom-right) */}
      <button
        id="btn-floating-ai-bubble"
        onClick={onOpenAIAssistant}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-slate-950 hover:bg-slate-900 text-cyan-400 flex items-center justify-center shadow-2xl border-2 border-cyan-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
        title="Open HEALX AI Assistant"
      >
        <Bot className="w-7 h-7 text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full ring-2 ring-slate-950 animate-ping" />
      </button>

      {/* Success Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your consultation token <strong className="font-mono text-cyan-700">#APT-8824-HX</strong> has been issued.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Specialist:</span>
                <span className="font-bold text-slate-800">{selectedSpecialist.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time & Date:</span>
                <span className="font-mono font-bold text-slate-800">Oct 24 • {selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-800">{selectedSpecialist.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setBookingSuccessModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Done
              </button>
              <button
                onClick={() => {
                  setBookingSuccessModal(false);
                  setActiveView('patient-portal');
                }}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Go to Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
