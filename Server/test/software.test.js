const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assurez-vous d'importer votre application correcte
const expect = chai.expect;

chai.use(chaiHttp);

describe('Logiciels', () => {
  // Cette variable stockera l'ID du logiciel créé pour les tests ultérieurs
  let softwareId;

  it('Devrait retourner tous les logiciels', (done) => {
    chai
      .request(app)
      .get('/softwares')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Devrait créer un logiciel', (done) => {
    const newSoftware = {
      name: 'Logiciel de test',
      version: '1.0',
      // Autres données nécessaires pour créer un logiciel
    };

    chai
      .request(app)
      .post('/softwares')
      .send(newSoftware)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        softwareId = res.body._id; // Stockez l'ID pour les tests ultérieurs
        done();
      });
  });

  it('Devrait récupérer un logiciel par son ID', (done) => {
    chai
      .request(app)
      .get(`/softwares/${softwareId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id').equal(softwareId);
        done();
      });
  });

  it('Devrait mettre à jour un logiciel', (done) => {
    const updatedSoftware = {
      name: 'Logiciel de test mis à jour',
      version: '2.0',
      // Autres données mises à jour
    };

    chai
      .request(app)
      .put(`/softwares/${softwareId}`)
      .send(updatedSoftware)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name').equal(updatedSoftware.name);
        done();
      });
  });

  it('Devrait supprimer un logiciel', (done) => {
    chai
      .request(app)
      .delete(`/softwares/${softwareId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
