from flask import Flask, request, jsonify
import os
import ibm_db

app = Flask(__name__, static_url_path='')

port = int(os.getenv('PORT', 8000))


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/resultado', methods=['POST'])
def put_visitor():
    veiculo = request.json['veiculo']
    try:
        distancia = int(request.json['distancia'])
        conn = ibm_db.connect("DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-03.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=vhl83324;PWD=wgwzm41104^v7kd0;", "", "")
        sql = "SELECT * FROM  VHL83324.TABELA_CARBONO WHERE Modalidade = ?"
        stmt = ibm_db.prepare(conn, sql)
        ibm_db.bind_param(stmt, 1, veiculo.upper())
        ibm_db.execute(stmt)

        dictionary = ibm_db.fetch_both(stmt)
        teste = dictionary['EMISSAO_KM']
        resultado = float(distancia) * float(teste.replace(",", "."))

        data = {'veiculo': round(resultado, 2)}
    except ValueError:
        data = 'Valor incorreto inserido no campo de distancia'

    return jsonify(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
