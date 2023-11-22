const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assurez-vous d'importer votre application correcte
const expect = chai.expect;

chai.use(chaiHttp);

describe('Matériels', () => {
  // Cette variable stockera l'ID du matériel créé pour les tests ultérieurs
  let hardwareId;

  it('Devrait retourner tout le matériel', (done) => {
    chai
      .request(app)
      .get('/hardwares')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Devrait créer du matériel', (done) => {
    const newHardware = {
      name: 'Matériel de test',
      type: 'Type de test',
      serialNumber: '12345',
      // Autres données nécessaires pour créer du matériel
    };

    chai
      .request(app)
      .post('/hardwares')
      .send(newHardware)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        hardwareId = res.body._id; // Stockez l'ID pour les tests ultérieurs
        done();
      });
  });

  it('Devrait récupérer du matériel par son ID', (done) => {
    chai
      .request(app)
      .get(`/hardwares/${hardwareId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id').equal(hardwareId);
        done();
      });
  });

  it('Devrait mettre à jour du matériel', (done) => {
    const updatedHardware = {
      name: 'Matériel de test mis à jour',
      // Autres données mises à jour
    };

    chai
      .request(app)
      .put(`/hardwares/${hardwareId}`)
      .send(updatedHardware)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name').equal(updatedHardware.name);
        done();
      });
  });

  it('Devrait supprimer du matériel', (done) => {
    chai
      .request(app)
      .delete(`/hardwares/${hardwareId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
