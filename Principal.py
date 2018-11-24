# -*- Coding: UTF-8 -*-
# coding: utf-8
from flask import Flask, request
import os
import ibm_db

app = Flask(__name__, static_url_path='/static')
port = int(os.getenv('PORT', 8000))


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/resultado', methods=['POST'])
def resultado():
    erro = {}
    erro_numerico = {}
    erro_banco = ''
    y = 0
    resultado_total = 0
    resultado_total_mensal = 0
    json_site = request.json
    qtde = len(json_site)
    x = 0
    while x < qtde:
        json_site = request.json[x]
        tipo = json_site['type'].upper()
        if json_site['object'] != '':
                if tipo == 'VEICULO':
                    distancia = json_site['elems'][0]['value']
                    dias = json_site['elems'][1]['value']
                    if distancia.isnumeric() and dias.isnumeric():
                        veiculo = json_site['object'].upper()
                        try:
                            conn = ibm_db.connect("DATABASE=BLUDB;"
                                                  "HOSTNAME=XXXXXXXXXXXX.bluemix.net;"
                                                  "PORT=50000;"
                                                  "PROTOCOL=TCPIP;"
                                                  "UID=XXXXXXXXX;"
                                                  "PWD=XXXXXXXXX;", "", "")
                            sql = "SELECT * FROM  VHL83324.TABELA_CARBONO WHERE Modalidade = ?"
                            stmt = ibm_db.prepare(conn, sql)
                            ibm_db.bind_param(stmt, 1, veiculo.replace(' ', '').replace('SELECT', ''))
                            ibm_db.execute(stmt)
                            dictionary = ibm_db.fetch_both(stmt)
                            emissao = dictionary['EMISSOES_PASSAGEIROS']

                            resultado_parcial = float(distancia) * float(emissao.replace(",", "."))
                            resultado_parcial_mensal = resultado_parcial * int(dias) * 4

                            resultado_total = resultado_total + resultado_parcial
                            resultado_total_mensal = resultado_total_mensal + resultado_parcial_mensal
                        except:
                            erro_banco = 'Falha ao procurar o objeto no banco de dados'
                    else:
                        erro_numerico[y] = x + 1

                elif tipo == 'ELETRONICO':
                    potencia = json_site['elems'][0]['value']
                    minutos = json_site['elems'][1]['value']
                    dias = json_site['elems'][2]['value']
                    if potencia.isnumeric() and dias.isnumeric() and minutos.isnumeric():
                        horas = float(minutos) / 60
                        kw = float(potencia) / 1000
                        kwh = kw * horas

                        resultado_parcial = kwh * 0.1355
                        resultado_parcial_mensal = resultado_parcial * int(dias) * 4

                        resultado_total = resultado_total + resultado_parcial
                        resultado_total_mensal = resultado_total_mensal + resultado_parcial_mensal
                    else:
                        erro_numerico[y] = x + 1
                elif tipo == 'AGUA':
                    consumo = json_site['elems'][0]['value']
                    if consumo.isnumeric():
                        resultado_parcial_mensal = int(consumo) * 0.0176
                        resultado_parcial = resultado_parcial_mensal / 30
                        resultado_total = resultado_total + resultado_parcial
                        resultado_total_mensal = resultado_total_mensal + resultado_parcial_mensal
                    else:
                        erro_numerico[y] = x + 1
        else:
            erro[y] = x + 1
            y += 1

        x += 1
    if erro_banco is '':
        if len(erro) == 0 and len(erro_numerico) == 0:
            data = 'Sua pegada de carbono diária é {} KgCOE' \
                   ' e mensal é {} KgCOE'.format(round(resultado_total, 2), round(resultado_total_mensal, 2))
        elif len(erro) == 1:
            data = 'ERRO: Ícone de objeto não selecionado no formulário '+str(erro[0])
        elif len(erro) == 2:
            data = 'ERRO: Ícone de objeto não selecionado nos formulários '+str(erro[0])+' e '+str(erro[1])
        elif len(erro) > 2:
            data = 'ERRO: Ícone de objeto não selecionado em todos os formulários'
        elif len(erro_numerico) == 1:
            data = 'ERRO: texto ou número negativo inserido no formulário '+str(erro_numerico[0])
        elif len(erro_numerico) == 2:
            data = 'ERRO: texto ou número negativo inserido no formulário '+str(erro_numerico[0])+' e '+str(erro_numerico[1])
        elif len(erro_numerico) > 2:
            data = 'ERRO: texto ou número negativo inserido em todos os formulários'
        else:
            data = 'ERRO'
    else:
        data = erro_banco
    return data


@app.route('/valores', methods=['POST'])
def valores():
    json_site = request.json
    objeto = json_site['object'].upper()

    conn = ibm_db.connect("DATABASE=BLUDB;"
                          "HOSTNAME=XXXXXXXXXXX.bluemix.net;"
                          "PORT=50000;"
                          "PROTOCOL=TCPIP;"
                          "UID=XXXXXXX;"
                          "PWD=XXXXXXX;", "", "")
    sql = "SELECT * FROM  VHL83324.DADOS_SLIDERS WHERE OBJETO = ?"
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt, 1, objeto.replace(' ', '').replace('SELECT', ''))
    ibm_db.execute(stmt)
    dictionary = ibm_db.fetch_both(stmt)
    try:
        min_km_pot = str(dictionary['MIN_KM_POT'])
        max_km_pot = str(dictionary['MAX_KM_POT'])
        avg_km_pot = str(dictionary['AVG_KM_POT'])

        min_dias = str(dictionary['MIN_DIAS'])
        max_dias = str(dictionary['MAX_DIAS'])
        avg_dias = str(dictionary['AVG_DIAS'])

        min_minutos = str(dictionary['MIN_MINUTOS'])
        max_minutos = str(dictionary['MAX_MINUTOS'])
        avg_minutos = str(dictionary['AVG_MINUTOS'])

        if min_minutos == 'None' and min_dias == 'None':
            resultado = '[{"min":"' + min_km_pot + '", "max":"' + max_km_pot + '", "value":"' + avg_km_pot + '"}]'

        elif min_minutos == 'None' and min_dias != 'None':
            resultado = '[{"min":"' + min_km_pot + '", "max":"' + max_km_pot + '", "value":"' + avg_km_pot + '"},' \
                        ' {"min":"' + min_dias + '", "max":"' + max_dias + '", "value":"' + avg_dias + '"}]'
        else:
            resultado = '[{"min":"' + min_km_pot + '", "max":"' + max_km_pot + '", "value":"' + avg_km_pot + '"},' \
                        ' {"min":"' + min_minutos + '", "max":"' + max_minutos + '", "value":"' + avg_minutos + '"},' \
                        ' {"min":"' + min_dias + '", "max":"' + max_dias + '", "value":"' + avg_dias + '"}]'
    except TypeError:
        resultado = 'ERRO: Objeto não identificado'

    return resultado


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
