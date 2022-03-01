import Appointment from '../..';
import Employee from '../../../Employee';
import getAvailableTimes from '../get-available-times';

describe('get available times', () => {
  const employeesSpy = jest.spyOn(Employee, 'getList');
  const appointmentByIdSpy = jest.spyOn(Appointment, 'getById');

  it('should get available times', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 1, name: 'Marco', startsAt: '08:00', finishesAt: '18:00',
    }, {
      id: 2, name: 'Leo', startsAt: '08:00', finishesAt: '18:00',
    }, {
      id: 3, name: 'Gustavo', startsAt: '12:00', finishesAt: '18:00',
    }, {
      id: 4, name: 'Nath', startsAt: '08:00', finishesAt: '18:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 1, appointmentId: '100', startsAt: '09:30', finishesAt: '10:30',
    }, {
      employeeId: 1, appointmentId: '101', startsAt: '11:00', finishesAt: '11:20',
    }, {
      employeeId: 1, appointmentId: '102', startsAt: '16:00', finishesAt: '16:30',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 2, appointmentId: '103', startsAt: '10:30', finishesAt: '11:30',
    }, {
      employeeId: 2, appointmentId: '104', startsAt: '16:00', finishesAt: '16:20',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 3, appointmentId: '100', startsAt: '12:00', finishesAt: '14:00',
    }, {
      employeeId: 3, appointmentId: '106', startsAt: '16:00', finishesAt: '17:30',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 4, appointmentId: '107', startsAt: '11:00', finishesAt: '11:30',
    }, {
      employeeId: 4, appointmentId: '108', startsAt: '16:00', finishesAt: '17:00',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:30',
      '17:00',
      '17:30',
    ]);
  });

  it('should have available time at 14:30', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 1, name: 'Marco', startsAt: '13:20', finishesAt: '15:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 1, appointmentId: '1', startsAt: '13:30', finishesAt: '14:10',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual(['14:30']);
  });

  it('should have available time at 15:30', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 1, name: 'Marco', startsAt: '13:20', finishesAt: '15:00',
    }, {
      id: 2, name: 'Leo', startsAt: '15:30', finishesAt: '17:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 1, appointmentId: '1', startsAt: '13:30', finishesAt: '15:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 2, appointmentId: '2', startsAt: '16:00', finishesAt: '16:45',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual(['15:30']);
  });

  it('should not have available time', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 1, name: 'Marco', startsAt: '13:20', finishesAt: '15:00',
    }, {
      id: 2, name: 'Leo', startsAt: '15:30', finishesAt: '17:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 1, appointmentId: '1', startsAt: '13:30', finishesAt: '15:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 2, appointmentId: '2', startsAt: '15:30', finishesAt: '16:45',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([]);
  });

  it('should have available time at 08:30', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 1, name: 'Marco', startsAt: '08:20', finishesAt: '11:00',
    }, {
      id: 2, name: 'Leo', startsAt: '15:30', finishesAt: '17:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 1, appointmentId: '1', startsAt: '09:00', finishesAt: '11:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 2, appointmentId: '2', startsAt: '15:30', finishesAt: '16:45',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual(['08:30']);
  });

  it('should not have available time at 09:30-10:30, 11:00-11:20 and 16:00-16:30', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 1, name: 'Marco', startsAt: '08:00', finishesAt: '18:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 1, appointmentId: '100', startsAt: '09:30', finishesAt: '10:30',
    }, {
      employeeId: 1, appointmentId: '101', startsAt: '11:00', finishesAt: '11:20',
    }, {
      employeeId: 1, appointmentId: '102', startsAt: '16:00', finishesAt: '16:30',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '08:00',
      '08:30',
      '09:00',
      '10:30',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:30',
      '17:00',
      '17:30',
    ]);
  });

  it('should not have available time at 10:30-11:30 and 16:00-16:20', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 2, name: 'Leo', startsAt: '08:00', finishesAt: '18:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 2, appointmentId: '103', startsAt: '10:30', finishesAt: '11:30',
    }, {
      employeeId: 2, appointmentId: '104', startsAt: '16:00', finishesAt: '16:20',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:30',
      '17:00',
      '17:30',
    ]);
  });

  it('should not have available time at 12:00-14:00 and 16:00-17:30', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 3, name: 'Gustavo', startsAt: '12:00', finishesAt: '18:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 3, appointmentId: '100', startsAt: '12:00', finishesAt: '14:00',
    }, {
      employeeId: 3, appointmentId: '106', startsAt: '16:00', finishesAt: '17:30',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '17:30',
    ]);
  });

  it('should not have available time at 11:00-11:30 and 16:00-17:00', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 4, name: 'Nath', startsAt: '08:00', finishesAt: '18:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 4, appointmentId: '107', startsAt: '11:00', finishesAt: '11:30',
    }, {
      employeeId: 4, appointmentId: '108', startsAt: '16:00', finishesAt: '17:00',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '17:00',
      '17:30',
    ]);
  });

  it('should not have available time at 08:40-09:40', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 3, name: 'Gustavo', startsAt: '08:00', finishesAt: '12:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 3, appointmentId: '100', startsAt: '08:40', finishesAt: '09:40',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '08:00',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
    ]);
  });

  it('should not have available time at 08:40-09:40 and 10:40-11:40', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 3, name: 'Gustavo', startsAt: '08:00', finishesAt: '12:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 3, appointmentId: '100', startsAt: '08:40', finishesAt: '09:40',
    }, {
      employeeId: 3, appointmentId: '101', startsAt: '10:40', finishesAt: '11:40',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '08:00',
      '10:00',
    ]);
  });

  it('should not have available time at 08:40-09:40 and 11:00-11:30', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 3, name: 'Gustavo', startsAt: '08:00', finishesAt: '12:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 3, appointmentId: '100', startsAt: '08:40', finishesAt: '09:40',
    }, {
      employeeId: 3, appointmentId: '101', startsAt: '11:00', finishesAt: '11:30',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '08:00',
      '10:00',
      '10:30',
      '11:30',
    ]);
  });

  it('should not have available time at 08:40-09:40 and 11:00-12:00', async () => {
    expect.assertions(1);

    employeesSpy.mockResolvedValueOnce([{
      id: 3, name: 'Gustavo', startsAt: '08:00', finishesAt: '12:00',
    }]);
    appointmentByIdSpy.mockResolvedValueOnce([{
      employeeId: 3, appointmentId: '100', startsAt: '08:40', finishesAt: '09:40',
    }, {
      employeeId: 3, appointmentId: '101', startsAt: '11:00', finishesAt: '12:00',
    }]);

    const result = await getAvailableTimes();

    expect(result).toStrictEqual([
      '08:00',
      '10:00',
      '10:30',
    ]);
  });
});
