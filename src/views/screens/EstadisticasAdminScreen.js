import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useEstadisticas } from '../../viewmodels/EstadisticasAdminViewModel.js';

const EstadisticasScreen = () => {
  const {
    loading,
    error,
    ranking,
    recompensasRanking,
    usuariosCanjeosRanking,
    usuariosConSesiones,
    publicacionConMasLikes,
    autorPublicacion,
    refrescar,
  } = useEstadisticas();

  const getRankingIcon = (index) => {
    switch (index) {
      case 0:
        return '🏆';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  const getRankingLabel = (index) => {
    switch (index) {
      case 0:
        return 'Top 1';
      case 1:
        return 'Top 2';
      case 2:
        return 'Top 3';
      default:
        return `#${index + 1}`;
    }
  };

  const renderRankingCard = (title, subtitle, data, renderItem) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>🏆</Text>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.rankingList}>
        {data.map((item, index) => renderItem(item, index))}
      </View>
    </View>
  );

  const renderUsuarioRanking = (usuario, index) => (
    <View key={usuario._id || index} style={styles.rankingItem}>
      <View style={styles.leftSection}>
        <Text style={styles.rankingIcon}>{getRankingIcon(index)}</Text>
        <Image
          source={{
            uri: usuario.foto_perfil?.[0]?.url || 'https://via.placeholder.com/40',
          }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>
              {usuario.nombre} {usuario.apellido}
            </Text>
            <Text style={styles.rankingLabel}>{getRankingLabel(index)}</Text>
          </View>
          <Text style={styles.userSubtext}>{usuario.puntosAcumulados} puntos</Text>
        </View>
      </View>
      <View style={styles.pointsSection}>
        <Text style={styles.pointsNumber}>{usuario.puntosAcumulados}</Text>
        <Text style={styles.pointsLabel}>pts</Text>
      </View>
    </View>
  );

  const renderRecompensaRanking = (recompensa, index) => (
    <View key={recompensa._id || index} style={styles.rankingItem}>
      <View style={styles.leftSection}>
        <Text style={styles.rankingIcon}>{getRankingIcon(index)}</Text>
        <View style={styles.recompensaIcon}>
          <Text style={styles.recompensaEmoji}>🎁</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{recompensa.nombre}</Text>
            <Text style={styles.rankingLabel}>{getRankingLabel(index)}</Text>
          </View>
          <Text style={styles.userSubtext}>
            {recompensa.totalReclamada} veces reclamada
          </Text>
        </View>
      </View>
      <View style={styles.pointsSection}>
        <Text style={styles.pointsNumber}>{recompensa.totalReclamada}</Text>
        <Text style={styles.pointsLabel}>veces</Text>
      </View>
    </View>
  );

  const renderCanjeRanking = ([nombre, cantidad], index) => (
    <View key={nombre} style={styles.rankingItem}>
      <View style={styles.leftSection}>
        <Text style={styles.rankingIcon}>{getRankingIcon(index)}</Text>
        <View style={styles.recompensaIcon}>
          <Text style={styles.recompensaEmoji}>💰</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{nombre}</Text>
            <Text style={styles.rankingLabel}>{getRankingLabel(index)}</Text>
          </View>
          <Text style={styles.userSubtext}>{cantidad} canjeos</Text>
        </View>
      </View>
      <View style={styles.pointsSection}>
        <Text style={styles.pointsNumber}>{cantidad}</Text>
        <Text style={styles.pointsLabel}>canjeos</Text>
      </View>
    </View>
  );

  const renderSesionRanking = (usuario, index) => (
    <View key={usuario._id || index} style={styles.rankingItem}>
      <View style={styles.leftSection}>
        <Text style={styles.rankingIcon}>{getRankingIcon(index)}</Text>
        <Image
          source={{
            uri: usuario.foto_perfil?.[0]?.url || 'https://via.placeholder.com/40',
          }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>
              {usuario.nombre} {usuario.apellido}
            </Text>
            <Text style={styles.rankingLabel}>{getRankingLabel(index)}</Text>
          </View>
          <Text style={styles.userSubtext}>{usuario.totalSesiones} ingresos</Text>
        </View>
      </View>
      <View style={styles.pointsSection}>
        <Text style={styles.pointsNumber}>{usuario.totalSesiones}</Text>
        <Text style={styles.pointsLabel}>ingresos</Text>
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refrescar}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refrescar} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas de Participación</Text>
        <Text style={styles.subtitle}>
          Análisis de las participaciones de los usuarios
        </Text>
      </View>

      {renderRankingCard(
        'Rankings',
        'Top 5 mejores puntuaciones',
        ranking,
        renderUsuarioRanking
      )}

      {renderRankingCard(
        'Recompensas',
        'Top 5 más reclamadas',
        recompensasRanking,
        renderRecompensaRanking
      )}

      {renderRankingCard(
        'Canjeos',
        'Top 5 usuarios con más canjeos',
        usuariosCanjeosRanking,
        renderCanjeRanking
      )}

      {renderRankingCard(
        'Actividad',
        'Top 5 usuarios más activos',
        usuariosConSesiones,
        renderSesionRanking
      )}

      {/* Publicación con más likes */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>👍</Text>
          <View>
            <Text style={styles.cardTitle}>Publicación Popular</Text>
            <Text style={styles.cardSubtitle}>Publicación con más likes</Text>
          </View>
        </View>
        {publicacionConMasLikes && (
          <View style={styles.publicacionContainer}>
            {publicacionConMasLikes.imagenes?.[0]?.url && (
              <Image
                source={{ uri: publicacionConMasLikes.imagenes[0].url }}
                style={styles.publicacionImage}
              />
            )}
            <Text style={styles.publicacionDescripcion}>
              {publicacionConMasLikes.descripcion || 'Sin descripción'}
            </Text>
            <View style={styles.publicacionFooter}>
              <View style={styles.autorContainer}>
                {autorPublicacion?.foto_perfil?.[0]?.url && (
                  <Image
                    source={{ uri: autorPublicacion.foto_perfil[0].url }}
                    style={styles.autorImage}
                  />
                )}
                <Text style={styles.autorNombre}>
                  {autorPublicacion
                    ? `${autorPublicacion.nombre} ${autorPublicacion.apellido}`
                    : 'Autor desconocido'}
                </Text>
              </View>
              <View style={styles.likesContainer}>
                <Text style={styles.likesEmoji}>👍</Text>
                <Text style={styles.likesCount}>
                  {publicacionConMasLikes.cantidadLikes || 0}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fef7f0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '500',
  },
  rankingList: {
    padding: 0,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankingIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: '#e9ecef',
  },
  recompensaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef7f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recompensaEmoji: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  rankingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff6b35',
    backgroundColor: '#fef7f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  userSubtext: {
    fontSize: 14,
    color: '#6c757d',
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  pointsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  publicacionContainer: {
    padding: 20,
  },
  publicacionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  publicacionDescripcion: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 15,
    lineHeight: 20,
  },
  publicacionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  autorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: '#e9ecef',
  },
  autorNombre: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef7f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  likesEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  likesCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EstadisticasScreen;