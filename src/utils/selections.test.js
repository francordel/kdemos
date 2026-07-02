import { mergeUserSelections } from './selections';

describe('mergeUserSelections', () => {
  it('usuario nuevo (sin backend): guarda el voto y sus franjas', () => {
    const res = mergeUserSelections(
      undefined,
      { green: ['D1'], red: [], orange: [] },
      { D1: ['morning'] },
      ['D1']
    );
    expect(res).toEqual({ green: ['D1'], red: [], orange: [], timeSlots: { D1: ['morning'] } });
  });

  it('cambiar un día a "no disponible" elimina sus franjas', () => {
    const backend = { green: ['D1'], red: [], orange: [], timeSlots: { D1: ['morning'] } };
    const res = mergeUserSelections(
      backend,
      { green: [], red: ['D1'], orange: [] },
      {},
      ['D1']
    );
    expect(res.red).toEqual(['D1']);
    expect(res.green).toEqual([]);
    expect(res.timeSlots).toEqual({});
  });

  it('voto en blanco: quita la fecha de todos los votos y sus franjas', () => {
    const backend = { green: ['D1'], red: [], orange: [], timeSlots: { D1: ['night'] } };
    const res = mergeUserSelections(
      backend,
      { green: [], red: [], orange: [] }, // sin voto local para D1
      {},
      ['D1']
    );
    expect(res.green).toEqual([]);
    expect(res.red).toEqual([]);
    expect(res.orange).toEqual([]);
    expect(res.timeSlots).toEqual({});
  });

  it('preserva días del backend que no se tocaron en la sesión', () => {
    const backend = {
      green: ['D1', 'D2'],
      red: [],
      orange: [],
      timeSlots: { D1: ['morning'], D2: ['night'] }
    };
    const res = mergeUserSelections(
      backend,
      { green: ['D2'], red: [], orange: [] },
      { D2: ['afternoon'] },
      ['D2'] // solo se modificó D2
    );
    expect(res.green.sort()).toEqual(['D1', 'D2']);
    expect(res.timeSlots.D1).toEqual(['morning']); // intacto
    expect(res.timeSlots.D2).toEqual(['afternoon']); // actualizado (antes era night)
  });

  it('día disponible sin franjas marcadas no guarda entrada de franjas', () => {
    const res = mergeUserSelections(
      {},
      { green: ['D1'], red: [], orange: [] },
      { D1: [] }, // franjas vacías
      ['D1']
    );
    expect(res.green).toEqual(['D1']);
    expect(res.timeSlots).toEqual({});
  });

  it('conserva franjas en días "quizás" (orange)', () => {
    const res = mergeUserSelections(
      {},
      { green: [], red: [], orange: ['D1'] },
      { D1: ['midday', 'afternoon'] },
      ['D1']
    );
    expect(res.orange).toEqual(['D1']);
    expect(res.timeSlots.D1).toEqual(['midday', 'afternoon']);
  });

  it('acepta modifiedDates como Set', () => {
    const res = mergeUserSelections(
      {},
      { green: ['D1'], red: [], orange: [] },
      { D1: ['dawn'] },
      new Set(['D1'])
    );
    expect(res.green).toEqual(['D1']);
    expect(res.timeSlots.D1).toEqual(['dawn']);
  });

  it('no muta los objetos de entrada del backend', () => {
    const backend = { green: ['D1'], red: [], orange: [], timeSlots: { D1: ['morning'] } };
    const backendCopy = JSON.parse(JSON.stringify(backend));
    mergeUserSelections(backend, { green: [], red: ['D1'], orange: [] }, {}, ['D1']);
    expect(backend).toEqual(backendCopy);
  });
});
