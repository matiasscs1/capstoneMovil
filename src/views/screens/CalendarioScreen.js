import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import { useActividadesViewModel } from '../../viewmodels/ActividadesViewModel.js';
import { styles } from '../../styles/CalendarioScreen.styles.js';

const COLOR_NARANJA = '#FF7F32';

export default function CalendarioScreen() {
  const { actividades, cargarActividades, loading, error } = useActividadesViewModel();
  const [selectedDate, setSelectedDate] = useState(null);

  // Mapear eventos por fecha (YYYY-MM-DD)
  const eventosPorDia = {};
  actividades.forEach((a) => {
    const fechaInicio = new Date(a.fechaInicio);
    const fechaFin = a.fechaFin ? new Date(a.fechaFin) : fechaInicio;
    let d = new Date(fechaInicio);
    while (d <= fechaFin) {
      const key = d.toISOString().split('T')[0];
      if (!eventosPorDia[key]) eventosPorDia[key] = [];
      eventosPorDia[key].push(a);
      d.setDate(d.getDate() + 1);
    }
  });

  // Marcar fechas
  const markedDates = {};
  Object.keys(eventosPorDia).forEach((date) => {
    markedDates[date] = {
      marked: true,
      dotColor: COLOR_NARANJA,
      selected: date === selectedDate,
      selectedColor: COLOR_NARANJA,
      disableTouchEvent: false,
    };
  });
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = { selected: true, selectedColor: '#FFF3EA' };
  }

  useEffect(() => {
    cargarActividades();
  }, []);

  const eventosDia = selectedDate ? eventosPorDia[selectedDate] || [] : [];

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLOR_NARANJA} style={{ marginTop: 34 }} />
      ) : (
        <>
          <Animatable.View animation="fadeInDown" duration={600} style={styles.animCalendar}>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={{
                backgroundColor: '#fff',
                calendarBackground: '#fff',
                selectedDayBackgroundColor: COLOR_NARANJA,
                selectedDayTextColor: '#fff',
                todayTextColor: COLOR_NARANJA,
                dayTextColor: '#222',
                textSectionTitleColor: COLOR_NARANJA,
                monthTextColor: COLOR_NARANJA,
                arrowColor: COLOR_NARANJA,
                textDayFontWeight: '500',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '500',
                textDayFontSize: 17,
                textMonthFontSize: 20,
                textDayHeaderFontSize: 13,
                dotColor: COLOR_NARANJA,
                selectedDotColor: '#fff',
                indicatorColor: COLOR_NARANJA,
                textDisabledColor: '#bfc9da',
                borderRadius: 18,
              }}
              style={styles.calendar}
            />
          </Animatable.View>
          <View style={styles.detalleContainer}>
            {selectedDate ? (
              <Animatable.View animation="fadeIn" duration={500} key={selectedDate}>
                {eventosDia.length > 0 ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 8 }}
                  >
                    {eventosDia.map((ev, idx) => (
                      <Animatable.View
                        key={idx}
                        animation="fadeInUp"
                        delay={100 * idx}
                        duration={500}
                        style={styles.eventoCard}
                      >
                        <Text style={styles.eventoTitulo}>{ev.titulo}</Text>
                        <Text style={styles.eventoDescripcion} numberOfLines={2} ellipsizeMode="tail">
                          {ev.descripcion}
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                          <Text style={styles.eventoSubinfo}>📅 {new Date(ev.fechaInicio).toLocaleDateString('es-EC')}</Text>
                          {ev.fechaFin && ev.fechaFin !== ev.fechaInicio ? (
                            <Text style={styles.eventoSubinfo}>⏰ Hasta: {new Date(ev.fechaFin).toLocaleDateString('es-EC')}</Text>
                          ) : null}
                          {ev.lugar ? <Text style={styles.eventoSubinfo}>📍 {ev.lugar}</Text> : null}
                        </View>
                      </Animatable.View>
                    ))}
                  </ScrollView>
                ) : (
                  <Animatable.Text animation="fadeIn" duration={600} style={styles.noEventos}>
                    No hay actividades para este día.
                  </Animatable.Text>
                )}
              </Animatable.View>
            ) : (
              <Animatable.Text animation="fadeIn" duration={700} style={styles.noEventos}>
                Toca un día para ver actividades.
              </Animatable.Text>
            )}
          </View>
        </>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

