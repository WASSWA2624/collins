import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Select, Text, TextField } from '@platform/components';
import useFacilityManagementScreen from './useFacilityManagementScreen';

const statusToneStyles = {
  VERIFIED: 'successBadge',
  PENDING: 'warningBadge',
  REJECTED: 'neutralBadge',
  SUSPENDED: 'dangerBadge',
};

const SummaryItem = ({ label, value }) => (
  <View style={styles.summaryItem}>
    <Text variant="caption">{label}</Text>
    <Text variant="h2">{String(value)}</Text>
  </View>
);

const StatusBadge = ({ status }) => {
  const toneStyle = statusToneStyles[status] || 'neutralBadge';
  return (
    <View style={[styles.badge, styles[toneStyle]]}>
      <Text variant="caption">{status || 'UNKNOWN'}</Text>
    </View>
  );
};

const Section = ({ children, meta, testID, title }) => (
  <View style={styles.section} testID={testID}>
    <View style={styles.sectionHeader}>
      <Text variant="h2">{title}</Text>
      {meta ? <Text variant="caption">{meta}</Text> : null}
    </View>
    {children}
  </View>
);

const EmptyState = ({ detail, title }) => (
  <View style={styles.emptyState}>
    <Text variant="label">{title}</Text>
    {detail ? <Text variant="caption">{detail}</Text> : null}
  </View>
);

const formatFacilityMeta = (facility = {}) =>
  [facility.registryCode, facility.district, facility.region, facility.type, facility.ownership]
    .filter(Boolean)
    .join(' - ');

const countEntries = (facility = {}) =>
  Object.entries(facility.counts || {})
    .filter(([, count]) => Number(count || 0) > 0)
    .map(([key, count]) => `${key}: ${count}`);

const FacilityRow = ({ facility, onSelect, selected, testId }) => (
  <Pressable
    onPress={onSelect}
    style={[styles.facilityRow, selected ? styles.selectedRow : null]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    testID={`${testId}-${facility.id}`}
  >
    <View style={styles.facilityHeading}>
      <View style={styles.flex}>
        <Text variant="h3">{facility.name}</Text>
        <Text variant="caption">{formatFacilityMeta(facility) || 'No registry metadata'}</Text>
      </View>
      <StatusBadge status={facility.verificationStatus} />
    </View>
    <View style={styles.countRow}>
      {countEntries(facility).length ? (
        countEntries(facility).slice(0, 4).map((entry) => (
          <View key={entry} style={styles.countBadge}>
            <Text variant="caption">{entry}</Text>
          </View>
        ))
      ) : (
        <Text variant="caption">No linked operational data</Text>
      )}
    </View>
  </Pressable>
);

const SearchPanel = ({ screen }) => (
  <View style={styles.searchPanel}>
    <TextField
      label="Search facilities"
      placeholder="Name, registry code, district, region, type, ownership, or status"
      type="search"
      value={screen.query}
      onChangeText={screen.setQuery}
      style={styles.searchInput}
      testID={screen.testIds.search}
    />
    <Button
      variant="outline"
      size="small"
      disabled={!screen.hasFilters}
      onPress={screen.clearSearch}
      testID={screen.testIds.clearSearch}
    >
      Clear
    </Button>
  </View>
);

const DetailsForm = ({ screen }) => (
  <View style={styles.detailsForm}>
    <View style={styles.selectedPanel}>
      <View style={styles.flex}>
        <Text variant="label">{screen.isCreating ? 'New facility' : 'Selected facility'}</Text>
        <Text variant="h3">{screen.isCreating ? 'Create database facility' : screen.selectedFacility?.name}</Text>
        {!screen.isCreating ? (
          <Text variant="caption">{screen.selectedFacility?.id}</Text>
        ) : null}
      </View>
      {!screen.isCreating ? <StatusBadge status={screen.selectedFacility?.verificationStatus} /> : null}
    </View>

    <View style={styles.formGrid}>
      <TextField
        label="Facility name"
        value={screen.form.name}
        onChangeText={(value) => screen.setFormField('name', value)}
        style={styles.wideField}
      />
      <TextField
        label="Registry code"
        value={screen.form.registryCode}
        onChangeText={(value) => screen.setFormField('registryCode', value)}
        style={styles.formField}
      />
      <Select
        label="Verification status"
        options={screen.statusOptions}
        value={screen.form.verificationStatus}
        onValueChange={(value) => screen.setFormField('verificationStatus', value)}
        searchable={false}
        compact
        style={styles.formField}
        testID={screen.testIds.status}
      />
      <TextField
        label="District"
        value={screen.form.district}
        onChangeText={(value) => screen.setFormField('district', value)}
        style={styles.formField}
      />
      <TextField
        label="Region"
        value={screen.form.region}
        onChangeText={(value) => screen.setFormField('region', value)}
        style={styles.formField}
      />
      <TextField
        label="Facility type"
        value={screen.form.type}
        onChangeText={(value) => screen.setFormField('type', value)}
        style={styles.formField}
      />
      <TextField
        label="Ownership"
        value={screen.form.ownership}
        onChangeText={(value) => screen.setFormField('ownership', value)}
        style={styles.formField}
      />
      <TextField
        label="ABG availability"
        value={screen.form.abgAvailability}
        onChangeText={(value) => screen.setFormField('abgAvailability', value)}
        style={styles.formField}
      />
    </View>

    <View style={styles.dependencyBlock}>
      <Text variant="label">Delete readiness</Text>
      {screen.isCreating ? (
        <Text variant="caption">Save the facility before deletion is available.</Text>
      ) : screen.deleteBlockers.length ? (
        <View style={styles.blockerList}>
          <Text variant="caption">Deletion is blocked while this facility has linked data.</Text>
          {screen.deleteBlockers.map((dependency) => (
            <View key={dependency.key} style={styles.countBadge}>
              <Text variant="caption">{dependency.label}: {dependency.count}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text variant="caption">No linked data was found for this facility.</Text>
      )}
    </View>

    <View style={styles.actionsRow}>
      <Button
        variant="outline"
        size="small"
        onPress={screen.startCreate}
        disabled={screen.isSaving}
        testID={screen.testIds.createMode}
      >
        New Facility
      </Button>
      <Button
        variant="outline"
        size="small"
        onPress={screen.deleteSelectedFacility}
        disabled={!screen.canDelete || Boolean(screen.deletingFacilityId)}
        loading={Boolean(screen.deletingFacilityId)}
        testID={screen.testIds.delete}
      >
        Delete
      </Button>
      <Button
        size="small"
        onPress={screen.saveFacility}
        disabled={!screen.canSave}
        loading={screen.isSaving}
        testID={screen.testIds.save}
      >
        {screen.isCreating ? 'Create' : 'Save'}
      </Button>
    </View>
  </View>
);

const FacilityManagementScreen = () => {
  const screen = useFacilityManagementScreen();

  if (!screen.canManage) {
    return (
      <View style={styles.content} testID={screen.testIds.forbidden}>
        <Text variant="h1">Facility Management</Text>
        <Text variant="body">Platform administrator access is required.</Text>
      </View>
    );
  }

  const noFacilitiesTitle = screen.hasFilters ? 'No facilities match this search' : 'No facilities found';
  const noFacilitiesDetail = screen.hasFilters
    ? 'Adjust the search fields to find another facility.'
    : 'Database facilities will appear here after setup or import.';

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      testID={screen.testIds.screen}
      accessibilityLabel="Facility management screen"
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="h1">Facility Management</Text>
          <Text variant="body">Database-backed Uganda facility registry</Text>
        </View>
        <View style={styles.headerActions}>
          <Button
            variant="outline"
            size="small"
            onPress={screen.startCreate}
            disabled={screen.isSaving}
          >
            New Facility
          </Button>
          <Button
            variant="outline"
            size="small"
            onPress={screen.refresh}
            loading={screen.isLoading}
            testID={screen.testIds.refresh}
          >
            Refresh
          </Button>
        </View>
      </View>

      {screen.notice ? (
        <View
          style={[styles.notice, screen.notice.type === 'error' ? styles.errorNotice : styles.successNotice]}
          testID={screen.testIds.notice}
        >
          <Text variant="body">{screen.notice.message}</Text>
        </View>
      ) : null}

      <View style={styles.summary} testID={screen.testIds.summary}>
        <SummaryItem label="Facilities" value={screen.summary.total} />
        <SummaryItem label="Verified" value={screen.summary.verified} />
        <SummaryItem label="Pending" value={screen.summary.pending} />
        <SummaryItem label="Suspended" value={screen.summary.suspended} />
      </View>

      <View style={styles.columns}>
        <Section
          title="Facility Registry"
          meta={`${screen.filteredFacilities.length} shown`}
          testID={screen.testIds.list}
        >
          <SearchPanel screen={screen} />
          {screen.isLoading && screen.facilities.length === 0 ? (
            <EmptyState title="Loading facilities..." />
          ) : null}
          {!screen.isLoading && screen.filteredFacilities.length === 0 ? (
            <EmptyState title={noFacilitiesTitle} detail={noFacilitiesDetail} />
          ) : null}
          <View style={styles.list}>
            {screen.filteredFacilities.map((facility) => (
              <FacilityRow
                key={facility.id}
                facility={facility}
                selected={facility.id === screen.selectedFacilityId}
                onSelect={() => screen.setSelectedFacilityId(facility.id)}
                testId={screen.testIds.item}
              />
            ))}
          </View>
        </Section>

        <Section title="Facility Details" testID={screen.testIds.form}>
          <DetailsForm screen={screen} />
        </Section>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    gap: 14,
    padding: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: 4,
    minWidth: 240,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  notice: {
    borderLeftWidth: 3,
    padding: 10,
  },
  errorNotice: {
    backgroundColor: '#FFF1F1',
    borderLeftColor: '#B42318',
  },
  successNotice: {
    backgroundColor: '#ECFDF3',
    borderLeftColor: '#067647',
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    minWidth: 118,
    padding: 12,
  },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    flex: 1,
    gap: 12,
    minWidth: 320,
    padding: 14,
  },
  sectionHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  searchPanel: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  searchInput: {
    flexGrow: 1,
    minWidth: 260,
  },
  list: {
    gap: 10,
  },
  facilityRow: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  selectedRow: {
    backgroundColor: '#F0F7FF',
    borderColor: '#1D4ED8',
  },
  facilityHeading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
  countRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  countBadge: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  successBadge: {
    backgroundColor: '#ECFDF3',
    borderColor: '#067647',
  },
  warningBadge: {
    backgroundColor: '#FFFBEB',
    borderColor: '#B45309',
  },
  dangerBadge: {
    backgroundColor: '#FFF1F1',
    borderColor: '#B42318',
  },
  neutralBadge: {
    backgroundColor: '#F4F4F5',
    borderColor: '#A1A1AA',
  },
  detailsForm: {
    gap: 12,
  },
  selectedPanel: {
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 12,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  wideField: {
    flexBasis: '100%',
    flexGrow: 1,
    minWidth: 260,
  },
  formField: {
    flexGrow: 1,
    minWidth: 220,
  },
  dependencyBlock: {
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 10,
  },
  blockerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  emptyState: {
    backgroundColor: '#F8FAFC',
    borderColor: '#D8DEE8',
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
});

export default FacilityManagementScreen;
