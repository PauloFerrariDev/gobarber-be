import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";
import Appointment from "src/models/Appointment";
import AppointmentsRepository from "src/repositories/AppointmentsRepository";

interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async run({ provider, date }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentsInSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentsInSameDate) {
      throw Error("This appointment already booked");
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
