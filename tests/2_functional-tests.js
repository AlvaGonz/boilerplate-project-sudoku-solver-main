const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  // Test 1: Solve a puzzle with valid puzzle string: POST request to /api/solve
  test('Solve a puzzle with valid puzzle string', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        assert.lengthOf(res.body.solution, 81);
        done();
      });
  });

  // Test 2: Solve a puzzle with missing puzzle string: POST request to /api/solve
  test('Solve a puzzle with missing puzzle string', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  // Test 3: Solve a puzzle with invalid characters: POST request to /api/solve
  test('Solve a puzzle with invalid characters', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A';
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  // Test 4: Solve a puzzle with incorrect length: POST request to /api/solve
  test('Solve a puzzle with incorrect length', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  // Test 5: Solve a puzzle that cannot be solved: POST request to /api/solve
  test('Solve a puzzle that cannot be solved', (done) => {
    const puzzleString = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  // Test 6: Check a puzzle placement with all fields: POST request to /api/check
  test('Check a puzzle placement with all fields', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, true);
        done();
      });
  });

  // Test 7: Check a puzzle placement with single placement conflict: POST request to /api/check
  test('Check a puzzle placement with single placement conflict', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, coordinate: 'A2', value: '1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.include(res.body.conflict, 'row');
        done();
      });
  });

  // Test 8: Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test('Check a puzzle placement with multiple placement conflicts', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, coordinate: 'A2', value: '5' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 2);
        done();
      });
  });

  // Test 9: Check a puzzle placement with all placement conflicts: POST request to /api/check
  test('Check a puzzle placement with all placement conflicts', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, coordinate: 'B1', value: '1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 3);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  // Test 10: Check a puzzle placement with missing required fields: POST request to /api/check
  test('Check a puzzle placement with missing required fields', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  // Test 11: Check a puzzle placement with invalid characters: POST request to /api/check
  test('Check a puzzle placement with invalid characters', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A';
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  // Test 12: Check a puzzle placement with incorrect length: POST request to /api/check
  test('Check a puzzle placement with incorrect length', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  // Test 13: Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test('Check a puzzle placement with invalid placement coordinate', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, coordinate: 'J1', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  // Test 14: Check a puzzle placement with invalid placement value: POST request to /api/check
  test('Check a puzzle placement with invalid placement value', (done) => {
    const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleString, coordinate: 'A2', value: '0' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});

