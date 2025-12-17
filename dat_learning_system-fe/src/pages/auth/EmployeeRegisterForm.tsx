// components/forms/SmartRegisterForm.tsx
import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { type RoleType } from '../../utils/constants';
import { roleFormConfig, type FieldConfig } from '../../utils/roleFormConfig';
import { orgMock } from '../../mocks/org.mock';

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

type Props = {
    role: RoleType;
};

export default function SmartRegisterForm({ role }: Props) {
    const config: FieldConfig = roleFormConfig[role];

    const [division, setDivision] = React.useState<string[]>([]);
    const [department, setDepartment] = React.useState<string[]>([]);
    const [section, setSection] = React.useState<string>('');
    const [team, setTeam] = React.useState<string[]>([]);

    const selectedDivisions = orgMock.divisions.filter(d => division.includes(d.name));
    const selectedDepartments = selectedDivisions.flatMap(d =>
        d.departments.filter(dep => department.includes(dep.name))
    );
    const selectedDepartment = selectedDepartments[0];
    const sections = selectedDepartment?.sections || [];
    const selectedSection = sections.find(s => s.name === section);

    return (
        <Grid container spacing={3}>
            {/* Name */}
            <FormGrid size={{ xs: 12 }}>
                <FormLabel required>Name</FormLabel>
                <OutlinedInput size="small" required />
            </FormGrid>

            {/* Division */}
            {config.division !== 'hidden' && (
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel required>Division</FormLabel>
                    <Select
                        multiple={config.division === 'multi'}
                        value={division}
                        onChange={(e) => {
                            const value = typeof e.target.value === 'string' ? [e.target.value] : e.target.value;
                            setDivision(value);
                            setDepartment([]);
                            setSection('');
                            setTeam([]);
                        }}
                        size="small"
                    >
                        {orgMock.divisions.map(d => (
                            <MenuItem key={d.name} value={d.name}>
                                {d.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormGrid>
            )}

            {/* Department */}
            {config.department !== 'hidden' && (
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel required>Department</FormLabel>
                    <Select
                        multiple={config.department === 'multi'}
                        value={department}
                        disabled={selectedDivisions.length === 0 || config.department === 'readonly'}
                        onChange={(e) => {
                            const value = typeof e.target.value === 'string' ? [e.target.value] : e.target.value;
                            setDepartment(value);
                            setSection('');
                            setTeam([]);
                        }}
                        size="small"
                    >
                        {selectedDivisions.flatMap(d => d.departments).map(dep => (
                            <MenuItem key={dep.name} value={dep.name}>
                                {dep.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormGrid>
            )}

            {/* Section */}
            {config.section !== 'hidden' && (
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel required>Section</FormLabel>
                    <Select
                        value={section}
                        disabled={config.section === 'readonly' || selectedDepartments.length === 0}
                        onChange={(e) => setSection(e.target.value)}
                        size="small"
                    >
                        {sections.map(s => (
                            <MenuItem key={s.name} value={s.name}>
                                {s.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormGrid>
            )}

            {/* Team */}
            {config.team !== 'hidden' && (
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel required>Team</FormLabel>
                    <Select
                        multiple={config.team === 'multi'}
                        value={team}
                        disabled={
                            config.team === 'readonly' ||
                            (config.section !== 'hidden' && !selectedSection)
                        }
                        onChange={(e) => {
                            const value = typeof e.target.value === 'string' ? [e.target.value] : e.target.value;
                            setTeam(value);
                        }}
                        size="small"
                    >
                        {(config.section !== 'hidden' ? selectedSection?.teams || [] : selectedDepartments.flatMap(dep => dep.sections.flatMap(s => s.teams))).map(t => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </Select>
                </FormGrid>
            )}
            {division}
            {department}
            {section}
            {team}
        </Grid>
    );
}
