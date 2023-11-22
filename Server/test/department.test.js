const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assurez-vous d'importer votre application correcte
const expect = chai.expect;

chai.use(chaiHttp);

describe('Départements', () => {
  // Cette variable stockera l'ID du département créé pour les tests ultérieurs
  let departmentId;

  it('Devrait retourner tous les départements', (done) => {
    chai
      .request(app)
      .get('/departments')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Devrait créer un département', (done) => {
    const newDepartment = {
      name: 'Département de test',
      // Autres données nécessaires pour créer un département
    };

    chai
      .request(app)
      .post('/departments')
      .send(newDepartment)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        departmentId = res.body._id; // Stockez l'ID pour les tests ultérieurs
        done();
      });
  });

  it('Devrait récupérer un département par son ID', (done) => {
    chai
      .request(app)
      .get(`/departments/${departmentId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id').equal(departmentId);
        done();
      });
  });

  it('Devrait mettre à jour un département', (done) => {
    const updatedDepartment = {
      name: 'Département de test mis à jour',
      // Autres données mises à jour
    };

    chai
      .request(app)
      .put(`/departments/${departmentId}`)
      .send(updatedDepartment)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name').equal(updatedDepartment.name);
        done();
      });
  });

  it('Devrait supprimer un département', (done) => {
    chai
      .request(app)
      .delete(`/departments/${departmentId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
