const {
  UGANDA_HOSPITALS,
  getUgandaHospitalById,
  searchUgandaHospitals,
} = require('@features/facilities/ugandaHospitals');

describe('Uganda hospital registration options', () => {
  it('provides a curated mixed-ownership hospital list', () => {
    expect(UGANDA_HOSPITALS.length).toBeGreaterThanOrEqual(140);
    expect(UGANDA_HOSPITALS).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Mulago National Referral Hospital', ownership: 'Government' }),
      expect.objectContaining({ name: 'International Hospital Kampala', ownership: 'Private for-profit' }),
      expect.objectContaining({ name: 'Lacor Hospital', ownership: 'Private not-for-profit' }),
      expect.objectContaining({ name: 'Medipal International Hospital', ownership: 'Private for-profit' }),
      expect.objectContaining({ name: 'Kibuli Muslim Hospital', ownership: 'Private not-for-profit' }),
    ]));
  });

  it('searches by name, district, region, type, and ownership', () => {
    expect(searchUgandaHospitals('mulago', 5)[0].name).toBe('Mulago National Referral Hospital');
    expect(searchUgandaHospitals('private for-profit', 30).map((item) => item.name))
      .toEqual(expect.arrayContaining(['Nakasero Hospital', 'Kampala Hospital', 'Medipal International Hospital']));
    expect(searchUgandaHospitals('western general', 10).length).toBeGreaterThan(0);
    expect(searchUgandaHospitals('IHK', 5)[0].name).toBe('International Hospital Kampala');
  });

  it('returns a selected hospital by local option id', () => {
    expect(getUgandaHospitalById('ug-hospital-098')).toMatchObject({
      name: 'International Hospital Kampala',
      district: 'Kampala',
    });
    expect(getUgandaHospitalById('missing')).toBeNull();
  });
});
